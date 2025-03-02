import { inputErrorResponse, notFoundError, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { getSingleChat } from "../../db/queries";
import { chatSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["chats"];

const inputs = z.object({
  chatId: numberParamSchema,
});

export const getChat = createRoute({
  path: "/{chatId}",
  method: "get",
  tags,
  request: {
    params: inputs,
  },
  responses: {
    [OK]: jsonContent(chatSchema, "The requested chat."),
    [NOT_FOUND]: notFoundError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
  },
});

export const getChatHandler: AppRouteHandler<typeof getChat, AppBindingsWithUser> = async (c) => {
  const { chatId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const chat = await getSingleChat(userId, chatId);
  if (!chat) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(chat, OK);
};
