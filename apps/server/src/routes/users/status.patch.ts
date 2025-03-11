import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { users } from "../../db/schema";
import { getUserId } from "../../lib/auth";
import { internalServerError } from "../../schemas/response-schemas";
import { updateStatusSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

export const modifyUserStatus = createRoute({
  path: "/status",
  method: "patch",
  tags,
  request: {
    body: jsonContentRequired(updateStatusSchema, "The new status."),
  },
  responses: {
    [OK]: jsonContent(z.object({ newStatus: z.string() }), "The updated status."),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const modifyUserStatusHandler: AppRouteHandler<
  typeof modifyUserStatus,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { status } = c.req.valid("json");
  const { newStatus } = await updateUserStatus(userId, status);
  if (!newStatus) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json({ newStatus }, OK);
};

async function updateUserStatus(userId: string, status: string) {
  const [newStatus] = await db
    .update(users)
    .set({ status })
    .where(eq(users.id, userId))
    .returning({ newStatus: users.status });
  return newStatus;
}
