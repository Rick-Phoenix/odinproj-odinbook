import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { getUserChats } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { chatSchema } from "../../types/zod-schemas";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["chats"];

export const getChats = createRoute({
  path: "/",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(
      z.array(chatSchema).or(z.array(z.any()).length(0)),
      "The requested chats."
    ),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const chatsIndexHandler: AppRouteHandler<
  typeof getChats,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const chats = await getUserChats(userId);
  if (!chats) return c.json(internalServerError.content, BAD_REQUEST);
  return c.json(chats, OK);
};
