import db from "@/db";
import { usersTable } from "@db/schemas";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const users = new Hono();

const idSchema = z.preprocess(Number, z.number().int());
const userSchema = z.object({
  username: z.string().min(3).max(20),
});

users
  .post("/", zValidator("form", userSchema), async (c) => {
    const { username } = c.req.valid("form");
    const result = await db
      .insert(usersTable)
      .values({ name: username })
      .returning();
    return c.json(result);
  })
  .get("/", async (c) => {
    const allUsers = await db.select().from(usersTable).limit(20);
    return c.json({ users: allUsers });
  })
  .get("/:id", zValidator("param", z.object({ id: idSchema })), async (c) => {
    const { id } = c.req.valid("param");
    const result = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    return c.json({ user: result });
  })
  .put(
    "/:id",
    zValidator("param", z.object({ id: idSchema })),
    zValidator("form", userSchema),
    async (c) => {
      const data = c.req.valid("form");
      const { id } = c.req.valid("param");
      const result = await db
        .update(usersTable)
        .set({ name: data.username })
        .where(eq(usersTable.id, id))
        .returning();
      return c.json(result);
    }
  );

export default users;
