import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// PrismaClient 单例：从 DATABASE_URL 解析结构化参数
// （mariadb 驱动的 uri 解析在当前版本有 bug，故显式拆分）
function createPrisma(): PrismaClient {
  const url = new URL(process.env.DATABASE_URL ?? "");
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
