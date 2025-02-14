import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { getSingleChat } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { chatSchema } from "../../types/zod-schemas";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["chats"];

export const getChat = createRoute({
  path: "/{chatId}",
  method: "get",
  tags,
  request: {
    params: z.object({
      chatId: numberParamSchema,
    }),
  },
  responses: {
    [OK]: jsonContent(chatSchema, "The requested chat."),
    [BAD_REQUEST]: internalServerError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(
      z.object({
        chatId: numberParamSchema,
      })
    ),
  },
});

export const getChatHandler: AppRouteHandler<
  typeof getChat,
  AppBindingsWithUser
> = async (c) => {
  const { chatId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const chat = await getSingleChat(userId, chatId);
  if (!chat) return c.json(internalServerError.content, BAD_REQUEST);
  return c.json(chat, OK);
};
