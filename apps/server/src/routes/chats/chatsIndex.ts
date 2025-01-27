import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { getUserChats } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { chatSchema } from "../../types/zod-schemas";
import { badRequestError } from "../../utils/customErrors";

const tags = ["chats"];

export const chatsIndex = createRoute({
  path: "/",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(z.array(chatSchema), "The requested chat."),
    [BAD_REQUEST]: badRequestError.template,
  },
});

export const chatsIndexHandler: AppRouteHandler<
  typeof chatsIndex,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const chats = await getUserChats(userId);
  if (!chats) return c.json(badRequestError.content, BAD_REQUEST);
  return c.json(chats, OK);
};
