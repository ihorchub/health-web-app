import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema/index.js";

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set (apps/api/.env)");
  }
  if (!pool) {
    pool = new pg.Pool({
      connectionString,
      max: 10,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export async function checkDatabaseConnection(): Promise<boolean> {
  const client = await getPool().connect();
  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
