import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. See .env.example for connection settings.");
}

let url: URL;
try {
  url = new URL(databaseUrl);
} catch {
  throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
}

function isLocalDatabase(value: URL): boolean {
  return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(value.hostname.toLowerCase());
}

const sslMode = process.env.PGSSLMODE?.toLowerCase();
const ssl =
  sslMode === "disable" ? false :
  sslMode === "no-verify" ? { rejectUnauthorized: false } :
  isLocalDatabase(url) ? false : { rejectUnauthorized: false };

const poolConfig: PoolConfig = {
  connectionString: databaseUrl,
  max: Number(process.env.PG_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 30_000),
  connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS ?? 10_000),
  ssl,
};

const globalForDb = globalThis as typeof globalThis & {
  __nexusAcademicsPool?: Pool;
};

export const pool = globalForDb.__nexusAcademicsPool ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__nexusAcademicsPool = pool;
}

export const db = drizzle(pool);
