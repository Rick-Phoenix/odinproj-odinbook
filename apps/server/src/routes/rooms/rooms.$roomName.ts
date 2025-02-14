import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchRoom } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { roomWithPostsSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { notFoundError } from "../../utils/response-schemas";

const tags = ["rooms"];

export const getRoom = createRoute({
  path: "/{roomName}",
  method: "get",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    query: z.object({
      orderBy: z.enum(["likesCount", "createdAt"]).default("likesCount"),
    }),
  },
  responses: {
    [OK]: jsonContent(roomWithPostsSchema, "The room data with 0-20 posts."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getRoomHandler: AppRouteHandler<
  typeof getRoom,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { roomName } = c.req.valid("param");
  const { orderBy } = c.req.valid("query");

  const room = await fetchRoom(userId, roomName, orderBy);
  if (!room) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(room, OK);
};
