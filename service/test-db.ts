// 数据库连接测试脚本（MySQL / PostgreSQL 通用，可重复执行）
// 运行: pnpm exec tsx test-db.ts
import { prisma, dbProvider } from "./src/lib/prisma.js";

async function main() {
  // 1. 基础连接 + 版本（NOW()/VERSION() 两种数据库都支持）
  const rows = await prisma.$queryRaw<{ ok: number; now: Date; version: string }[]>`
    SELECT 1 AS ok, NOW() AS now, VERSION() AS version
  `;
  console.log(`✅ ${dbProvider} 连接成功 →`, `ok=${String(rows[0].ok)} version=${rows[0].version}`);

  // 2. 写入测试（upsert 保证可重复执行）
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", password: "123456", name: "测试用户" },
  });
  console.log("✅ User 就绪 →", `id=${user.id}`, user.email);

  // 3. 关联查询测试（无文章时才创建）
  let post = await prisma.post.findFirst({ where: { authorId: user.id } });
  if (!post) {
    post = await prisma.post.create({
      data: { title: "第一篇", content: "hello world", authorId: user.id },
    });
  }
  const withAuthor = await prisma.post.findUnique({
    where: { id: post.id },
    include: { author: true },
  });
  console.log("✅ 关联查询 →", `${withAuthor?.title} / 作者 ${withAuthor?.author?.email}`);

  // 4. 统计
  console.log("✅ User 总数 →", await prisma.user.count());
  console.log("✅ Post 总数 →", await prisma.post.count());

  await prisma.$disconnect();
  console.log("✅ 全部通过");
}

main().catch((e) => {
  console.error("❌ 连接/操作失败:", e);
  process.exit(1);
});
