import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { users } from "../../db/schema";
import { getUserId } from "../../lib/auth";
import { internalServerError, okResponse } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

export const deleteUser = createRoute({
  path: "/user",
  method: "delete",
  tags,
  request: {},
  responses: {
    [OK]: okResponse.template,
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const deleteUserHandler: AppRouteHandler<typeof deleteUser, AppBindingsWithUser> = async (
  c
) => {
  const userId = getUserId(c);
  const removal = await removeUser(userId);
  if (!removal) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function removeUser(userId: string) {
  const query = await db.delete(users).where(eq(users.id, userId));
  return query.rowCount;
}
