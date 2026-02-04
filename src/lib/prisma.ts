import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  // Neon (e maioria dos DBs cloud) exige SSL. 
  // O driver @prisma/adapter-pg precisa dessa config explícita no Pool para serverless.
  ssl: true 
});
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
