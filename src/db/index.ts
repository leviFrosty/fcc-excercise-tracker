import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schemas";

const url = process.env.DB_URL;
if (!url) {
  throw new Error("environment variable 'DB_FILE_NAME' expected.");
}

const sqlite = new Database(url);
sqlite.run(`PRAGMA foreign_keys = ON`);
const db = drizzle(sqlite, { schema, casing: "snake_case" });

export default db;
