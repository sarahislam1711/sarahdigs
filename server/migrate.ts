import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.DATABASE_URL!.includes("sslmode=disable") ? false : "require",
  max: 1,
});
const db = drizzle(client);

async function main() {
  console.log("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully!");
    await client.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
