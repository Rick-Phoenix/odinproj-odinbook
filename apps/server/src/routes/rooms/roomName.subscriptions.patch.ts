import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { subs } from "../../db/schema";
import {
  inputErrorResponse,
  internalServerError,
  okResponse,
} from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["rooms", "subscriptions"];

const inputs = {
  params: z.object({ roomName: z.string() }),
  query: z.object({ action: z.enum(["add", "remove"]) }),
};

export const subscribe = createRoute({
  path: "/{roomName}/subscriptions",
  method: "patch",
  tags,
  request: inputs,
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params.merge(inputs.query)),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const subscribeHandler: AppRouteHandler<typeof subscribe, AppBindingsWithUser> = async (
  c
) => {
  const { id: userId } = c.var.user;
  const { roomName } = c.req.valid("param");
  const { action } = c.req.valid("query");

  let queryAction;
  if (action === "add") {
    queryAction = await addSubscription(userId, roomName);
  } else {
    queryAction = await removeSubscription(userId, roomName);
  }
  if (!queryAction) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function addSubscription(userId: string, room: string) {
  const query = await db.insert(subs).values({ userId, room }).onConflictDoNothing();
  return query.rowCount;
}

async function removeSubscription(userId: string, room: string) {
  const query = await db.delete(subs).where(and(eq(subs.room, room), eq(subs.userId, userId)));
  return query.rowCount;
}
