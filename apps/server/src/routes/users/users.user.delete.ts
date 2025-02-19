import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";
import db from "../../db/dbConfig";
import { users } from "../../db/schema";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";
import { getUserId } from "../../utils/getters";
import { internalServerError, okResponse } from "../../utils/response-schemas";

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
