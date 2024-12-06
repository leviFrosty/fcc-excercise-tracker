import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  casing: "snake_case",
  schema: "./src/db/schemas",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  verbose: true,
});
