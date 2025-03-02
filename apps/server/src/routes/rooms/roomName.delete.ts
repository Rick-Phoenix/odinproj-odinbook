import { getUserId } from "@/lib/auth";
import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { rooms } from "../../db/schema";
import { internalServerError, okResponse } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["rooms"];

const inputs = z.object({ roomName: z.string() });

export const deleteRoom = createRoute({
  path: "/{roomName}",
  method: "delete",
  tags,
  request: {
    params: inputs,
  },
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const deleteRoomHandler: AppRouteHandler<typeof deleteRoom, AppBindingsWithUser> = async (
  c
) => {
  const userId = getUserId(c);
  const { roomName } = c.req.valid("param");
  const removal = await removeRoom(userId, roomName);
  if (!removal) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function removeRoom(userId: string, roomName: string) {
  const query = await db
    .delete(rooms)
    .where(and(eq(rooms.creatorId, userId), eq(rooms.name, roomName)));
  return query.rowCount;
}
