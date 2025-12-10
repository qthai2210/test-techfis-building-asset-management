import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export function createPrismaAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  return new PrismaPg(pool);
}
