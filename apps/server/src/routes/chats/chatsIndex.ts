import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { findOrCreateChat, getUserChats } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { chatSchema } from "../../types/zod-schemas";
import { badRequestError, customError } from "../../utils/customErrors";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["chats"];

export const getChats = createRoute({
  path: "/",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(z.array(chatSchema), "The requested chat."),
    [BAD_REQUEST]: badRequestError.template,
  },
});

export const chatsIndexHandler: AppRouteHandler<
  typeof getChats,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const chats = await getUserChats(userId);
  if (!chats) return c.json(badRequestError.content, BAD_REQUEST);
  return c.json(chats, OK);
};

const noUserError = customError(
  {
    message: "This user does not exist.",
    path: ["contactUsername"],
  },
  NOT_FOUND
);

export const createChat = createRoute({
  path: "/",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        contactUsername: z.string(),
      }),
      "The contact's username."
    ),
  },
  responses: {
    [OK]: jsonContent(chatSchema, "The new chat."),
    [NOT_FOUND]: noUserError.template,
    [BAD_REQUEST]: badRequestError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(
      z.object({
        contactUsername: z.string(),
      })
    ),
  },
});

export const createChatHandler: AppRouteHandler<
  typeof createChat,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const { contactUsername } = c.req.valid("json");
  const chat = await findOrCreateChat(userId, contactUsername);
  if (!chat) return c.json(noUserError.content, NOT_FOUND);
  return c.json(chat, OK);
};
