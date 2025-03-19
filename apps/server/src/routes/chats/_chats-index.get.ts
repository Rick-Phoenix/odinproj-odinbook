import { createRoute, z } from "@hono/zod-openapi";
import { asc, desc, gte, sql } from "drizzle-orm";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { internalServerError } from "../../schemas/response-schemas";
import { chatSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["chats"];

export const getChats = createRoute({
  path: "/",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(z.array(chatSchema).or(z.array(z.any()).length(0)), "The requested chats."),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const chatsIndexHandler: AppRouteHandler<typeof getChats, AppBindingsWithUser> = async (
  c
) => {
  const { id: userId } = c.var.user;
  const chats = await getUserChats(userId);
  if (!chats) return c.json(internalServerError.content, BAD_REQUEST);
  return c.json(chats, OK, {
    "Cache-Control": "private, max-age=0",
  });
};

async function getUserChats(userId: string) {
  const chats = await db.query.chatInstances.findMany({
    where(chat, { eq, and }) {
      return and(eq(chat.isDeleted, false), eq(chat.ownerId, userId));
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
    orderBy: (f) => desc(f.createdAt),
  });

  return chats.map((item) => ({ contact: item.contact, ...item.chat, lastRead: item.lastRead }));
}
