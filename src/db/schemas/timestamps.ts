import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
  createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedOn: integer({ mode: "timestamp_ms" }).$onUpdate(() => new Date()),
};
