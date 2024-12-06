import { Hono } from "hono";
import v1 from "./versions/v1";

const app = new Hono();

app.route("/api/v1/", v1);

export default {
  port: process.env.PORT ?? 8000,
  fetch: app.fetch,
};
