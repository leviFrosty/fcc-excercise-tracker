import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";

export const exercisesTable = sqliteTable("exercises", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  durationInMs: int().notNull(),
  description: text(),
});
