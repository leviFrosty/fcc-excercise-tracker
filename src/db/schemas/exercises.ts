import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./users";
import { timestamps } from "./timestamps";

export const exercisesTable = sqliteTable("exercises", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  durationInMs: int().notNull(),
  description: text(),
  date: text().$defaultFn(() => new Date().toISOString()),
  ...timestamps,
});
