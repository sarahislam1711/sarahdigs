import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Standard Postgres connection (works with Railway Postgres, or any Postgres).
const client = postgres(process.env.DATABASE_URL, {
  // Railway/most managed Postgres require SSL; relax cert verification for the managed cert.
  ssl: process.env.DATABASE_URL.includes("sslmode=disable") ? false : "require",
  max: 10,
});

export const db = drizzle(client, { schema });
