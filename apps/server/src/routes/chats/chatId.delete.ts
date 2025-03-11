import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { chatInstances } from "../../db/schema";
import {
  inputErrorResponse,
  internalServerError,
  numberParamSchema,
  okResponse,
} from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["chats"];

const inputs = z.object({ chatId: numberParamSchema });

export const removeChat = createRoute({
  path: "/{chatId}",
  method: "delete",
  tags,
  request: { params: inputs },
  responses: {
    [OK]: okResponse.template,
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
  },
});

export const removeChatHandler: AppRouteHandler<typeof removeChat, AppBindingsWithUser> = async (
  c
) => {
  const { chatId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const update = await softDeleteChat(userId, chatId);
  if (!update) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function softDeleteChat(ownerId: string, chatId: number) {
  const update = await db
    .update(chatInstances)
    .set({ isDeleted: true })
    .where(and(eq(chatInstances.chatId, chatId), eq(chatInstances.ownerId, ownerId)));
  return !!update.rowCount;
}
