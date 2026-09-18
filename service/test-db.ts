// Prisma + MySQL 连接测试脚本（临时验证用）
// 运行: pnpm exec tsx test-db.ts
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

async function main() {
  // mariadb 驱动的 uri 解析在当前版本有 bug（pool timeout），改用结构化参数
  const url = new URL(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  });
  const prisma = new PrismaClient({ adapter });

  // 1. 基础连接 + 版本
  const rows = await prisma.$queryRaw<{ ok: number; now: Date; version: string }[]>`
    SELECT 1 AS ok, NOW() AS now, VERSION() AS version
  `;
  console.log("✅ MySQL 连接成功 →", `ok=${String(rows[0].ok)} version=${rows[0].version}`);

  // 2. 写入测试
  const user = await prisma.user.create({
    data: { email: "test@example.com", password: "123456", name: "测试用户" },
  });
  console.log("✅ 创建 User →", `id=${user.id}`, user.email);

  // 3. 关联查询测试
  const post = await prisma.post.create({
    data: { title: "第一篇", content: "hello world", authorId: user.id },
  });
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
