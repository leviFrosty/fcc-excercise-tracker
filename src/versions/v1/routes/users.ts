import db from "@/db";
import { exercisesTable, usersTable } from "@db/schemas";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gte, lt, lte } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const users = new Hono();

const idSchema = z.preprocess(Number, z.number().int());
const userSchema = z.object({
  username: z.string().min(3).max(20),
});
const exerciseSchema = z.object({
  durationInMs: z.preprocess(Number, z.number().int()),
  description: z.string(),
  date: z.string().datetime().optional(),
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
      if (!result.length) {
        return c.json({ error: "user not found" }, 404);
      }
      return c.json(result);
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: idSchema })),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning();
      if (!result.length) {
        return c.json({ error: "user not found" }, 404);
      }
      return c.json({ success: true });
    }
  )
  .post(
    "/:id/exercises",
    zValidator("param", z.object({ id: idSchema })),
    zValidator("form", exerciseSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { description, date, durationInMs } = c.req.valid("form");
      try {
        const result = await db
          .insert(exercisesTable)
          .values({
            description,
            userId: id,
            date,
            durationInMs,
          })
          .returning({ id: exercisesTable.id });
        return c.json(result);
      } catch (error) {
        if (
          // @ts-ignore
          error?.message?.includes("FOREIGN KEY constraint failed")
        ) {
          return c.json({ error: "User not found" }, 404);
        }
        throw error;
      }
    }
  )
  .get(
    "/:id/exercises",
    zValidator("param", z.object({ id: idSchema })),
    zValidator(
      "query",
      z.object({
        limit: z.preprocess(
          (val) => (val ? Number(val) : undefined),
          z.number().int().optional()
        ),
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { limit, to, from } = c.req.valid("query");
      const maxLimit = 100;
      const defaultLimit = 10;
      const effectiveLimit = limit ? Math.min(maxLimit, limit) : defaultLimit;
      const result = await db
        .select()
        .from(exercisesTable)
        .where(
          and(
            eq(exercisesTable.userId, id),
            from ? gte(exercisesTable.date, from) : undefined,
            to ? lte(exercisesTable.date, to) : undefined
          )
        )
        .limit(effectiveLimit);
      return c.json({ count: result.length, log: result });
    }
  )
  .delete(
    "/:id/exercises",
    zValidator("param", z.object({ id: idSchema })),
    async (c) => {
      const { id } = c.req.valid("param");
      const result = await db
        .delete(exercisesTable)
        .where(eq(exercisesTable.id, id))
        .returning();
      if (!result.length) {
        return c.json({ error: "exercise not found" }, 404);
      }
      return c.json(result);
    }
  );

export default users;
