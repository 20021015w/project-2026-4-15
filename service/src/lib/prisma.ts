import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaPg } from "@prisma/adapter-pg";

// 当前数据库类型：mysql | postgres（由 .env 的 DB_PROVIDER 决定，切换用 pnpm db:use）
export const dbProvider = process.env.DB_PROVIDER === "postgres" ? "postgres" : "mysql";

// PrismaClient 单例：按 DB_PROVIDER 选择对应的驱动适配器
function createPrisma(): PrismaClient {
  if (dbProvider === "postgres") {
    // postgres 驱动支持直接传连接串
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.POSTGRES_URL }),
    });
  }
  // mariadb 驱动的 uri 解析在当前版本有 bug，故显式拆分结构化参数
  const url = new URL(process.env.MYSQL_URL ?? "");
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
  });
  return new PrismaClient({ adapter });
}

export const prisma = createPrisma();
