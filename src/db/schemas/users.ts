import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./timestamps";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  ...timestamps,
});
