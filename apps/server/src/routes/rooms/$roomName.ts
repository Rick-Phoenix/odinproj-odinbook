import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchRoom } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { roomSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";

const tags = ["rooms"];

export const getRoom = createRoute({
  path: "/{roomName}",
  method: "get",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
  },
  responses: {
    [OK]: jsonContent(roomSchema, "The room with posts."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getRoomHandler: AppRouteHandler<
  typeof getRoom,
  AppBindingsWithUser
> = async (c) => {
  const { roomName } = c.req.valid("param");
  const room = await fetchRoom(roomName);
  if (!room) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(room, OK);
};
