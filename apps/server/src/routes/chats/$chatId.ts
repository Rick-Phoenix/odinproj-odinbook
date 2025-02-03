import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { getSingleChat, registerMessage } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import {
  chatSchema,
  insertMessageSchema,
  messagesSchema,
} from "../../types/zod-schemas";
import { badRequestError } from "../../utils/customErrors";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

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
    [BAD_REQUEST]: badRequestError.template,
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
  if (!chat) return c.json(badRequestError.content, BAD_REQUEST);
  return c.json(chat, OK);
};

export const postMessage = createRoute({
  path: "/{chatId}",
  method: "post",
  tags,
  request: {
    params: z.object({
      chatId: numberParamSchema,
    }),
    body: jsonContentRequired(insertMessageSchema, "The text message."),
  },
  responses: {
    [OK]: jsonContent(messagesSchema, "The message sent."),
    [BAD_REQUEST]: badRequestError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(
      z.object({
        chatId: numberParamSchema,
      })
    ),
  },
});

export const postMessageHandler: AppRouteHandler<
  typeof postMessage,
  AppBindingsWithUser
> = async (c) => {
  const { chatId } = c.req.valid("param");
  const { text } = c.req.valid("json");
  const { id: userId } = c.var.user;
  const message = await registerMessage(chatId, userId, text);
  if (!message) return c.json(badRequestError.content, BAD_REQUEST);
  return c.json(message, OK);
};
