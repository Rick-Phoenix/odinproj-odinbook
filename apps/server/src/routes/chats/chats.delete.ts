import { createRoute, z } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { deleteChat } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError, okResponse } from "../../utils/response-schemas";

const tags = ["chats"];

const inputs = z.object({ chatId: numberParamSchema });

export const removeChat = createRoute({
  path: "/delete/{chatId}",
  method: "delete",
  tags,
  request: { params: inputs },
  responses: {
    [OK]: okResponse.template,
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
  },
});

export const removeChatHandler: AppRouteHandler<
  typeof removeChat,
  AppBindingsWithUser
> = async (c) => {
  const { chatId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const success = await deleteChat(userId, chatId);
  if (!success)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};
