import { Hono } from "hono";
import users from "./routes/users";

const v1 = new Hono();
v1.get("/health", (c) => c.json({ status: "OK" })).route("/users", users);

export default v1;
