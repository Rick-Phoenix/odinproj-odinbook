import { createRoute, z } from "@hono/zod-openapi";
import { asc, gte, sql } from "drizzle-orm";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import {
  inputErrorResponse,
  notFoundError,
  numberParamSchema,
} from "../../schemas/response-schemas";
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

async function getSingleChat(userId: string, chatId: number) {
  const chat = await db.query.chatInstances.findFirst({
    where(chat, { eq, and }) {
      return and(eq(chat.ownerId, userId), eq(chat.chatId, chatId), eq(chat.isDeleted, false));
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: {
        with: {
          messages: {
            where: (f) =>
              gte(
                f.id,
                sql<number>`
                  (
                    SELECT
                      "firstMessageId"
                    FROM
                      "chatInstances"
                    WHERE
                      "chatInstances"."chatId" = ${f.chatId}
                      AND "chatInstances"."ownerId" = ${userId}
                  )
                `
              ),
            orderBy: (f) => asc(f.createdAt),
          },
        },
      },
    },
    columns: { lastRead: true },
  });

  if (chat) return { contact: chat.contact, ...chat.chat, lastRead: chat.lastRead };

  return chat;
}
