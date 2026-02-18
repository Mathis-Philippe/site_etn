// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaBetterSqlite3({ url: "./dev.db" } as any);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;