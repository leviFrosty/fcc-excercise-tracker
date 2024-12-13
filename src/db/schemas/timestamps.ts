import { text } from "drizzle-orm/sqlite-core";

export const timestamps = {
  createdAt: text().$defaultFn(() => new Date().toISOString()),
  updatedOn: text().$onUpdate(() => new Date().toISOString()),
};
