import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // On Vercel / serverless runtimes, copy pre-seeded SQLite database to writable /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    try {
      const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db');
      const targetDb = '/tmp/dev.db';

      if (fs.existsSync(sourceDb) && !fs.existsSync(targetDb)) {
        fs.copyFileSync(sourceDb, targetDb);
      }

      if (fs.existsSync(targetDb)) {
        dbUrl = 'file:' + targetDb;
      }
    } catch (err) {
      console.warn('Vercel SQLite /tmp copy notice:', err);
    }
  }

  return new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
