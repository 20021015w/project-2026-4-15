#!/usr/bin/env node
// 数据库切换脚本：node scripts/use-db.mjs <mysql|postgres>
// 做三件事：
//   1. 更新 .env 的 DB_PROVIDER（prisma.config.ts 与运行时适配器都读它）
//   2. 同步 schema.prisma 中 datasource 的 provider（Prisma 7 只支持在 schema 里声明 provider）
//   3. 重新生成 Prisma Client（生成的 client 固化了 activeProvider 和对应的查询编译器）
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const target = process.argv[2];

if (target !== "mysql" && target !== "postgres") {
  console.error("用法: pnpm db:use <mysql|postgres>");
  process.exit(1);
}
const providerValue = target === "postgres" ? "postgresql" : "mysql";

// 1) .env: DB_PROVIDER
const envPath = join(root, ".env");
const env = readFileSync(envPath, "utf8");
if (!/^DB_PROVIDER=.*$/m.test(env)) {
  console.error("❌ .env 中找不到 DB_PROVIDER 配置项");
  process.exit(1);
}
writeFileSync(envPath, env.replace(/^DB_PROVIDER=.*$/m, `DB_PROVIDER=${target}`));

// 2) schema.prisma: datasource provider（只替换 datasource 块，不碰 generator 的 provider）
const schemaPath = join(root, "prisma", "schema.prisma");
const schema = readFileSync(schemaPath, "utf8");
const next = schema.replace(
  /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"[^"]*"/,
  `$1"${providerValue}"`,
);
if (next === schema) {
  console.error("❌ schema.prisma 中找不到 datasource provider，未做修改");
  process.exit(1);
}
writeFileSync(schemaPath, next);

// 3) 重新生成 client
console.log(`→ 切换到 ${target}，重新生成 Prisma Client...`);
execSync("pnpm exec prisma generate", { stdio: "inherit", cwd: root });

console.log(`✅ 当前数据库: ${target}`);
console.log("   同步表结构: pnpm db:push");
