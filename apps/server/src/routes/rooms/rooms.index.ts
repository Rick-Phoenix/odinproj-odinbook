import { createRoute } from "@hono/zod-openapi";
import { CONFLICT, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { insertRoom } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { insertRoomSchema, roomSchema } from "../../types/zod-schemas";
import { customError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["rooms"];

const roomExistsError = customError(
  { message: "A room with this name already exists.", path: ["name"] },
  CONFLICT
);

export const createRoom = createRoute({
  path: "/",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertRoomSchema, "The data for the room."),
  },
  responses: {
    [OK]: jsonContent(roomSchema, "The created room."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertRoomSchema),
    [CONFLICT]: roomExistsError.template,
  },
});

export const createRoomHandler: AppRouteHandler<
  typeof createRoom,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { name, category } = c.req.valid("json");
  const room = await insertRoom(userId, name, category);
  if (room === undefined) return c.json(roomExistsError.content, CONFLICT);
  return c.json({ ...room, isSubscribed: true }, OK);
};
