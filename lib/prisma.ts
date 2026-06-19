import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  const requiresSsl =
    databaseUrl?.includes("sslmode=require") ||
    databaseUrl?.includes("neon.tech") ||
    false;

  const pool = new Pool({
    ...(databaseUrl
      ? {
          connectionString: databaseUrl,
          ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
        }
      : {
          host: process.env.POSTGRES_HOST || "localhost",
          port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
          database: process.env.POSTGRES_DB || "project_brand_new_day",
          user: process.env.POSTGRES_USER || "postgres",
          password: process.env.POSTGRES_PASSWORD || "postgres",
        }),
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
