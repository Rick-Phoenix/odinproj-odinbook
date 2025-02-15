import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { chatInstances, messages } from "../../db/schema";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { insertMessageSchema } from "../../types/zod-schemas";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["chats"];

export const postMessage = createRoute({
  path: "/messages",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertMessageSchema, "The text message."),
  },
  responses: {
    [OK]: jsonContent(z.union([z.number(), z.string()]), "The message sent."),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertMessageSchema),
  },
});

export const postMessageHandler: AppRouteHandler<
  typeof postMessage,
  AppBindingsWithUser
> = async (c) => {
  const { text, receiver, chatId } = c.req.valid("json");
  const { id: userId } = c.var.user;
  if (chatId) {
    const message = await insertMessage(chatId, userId, text);
    if (!message)
      return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
    return c.json(message, OK);
  }

  const newChatId = await createChatInstance(userId, receiver, text);
  if (!newChatId)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(newChatId, OK);
};

async function insertMessage(chatId: number, userId: string, text: string) {
  const [message] = await db
    .insert(messages)
    .values({ text, userId, chatId })
    .returning({ text: messages.text });

  return message?.text;
}

async function createChatInstance(
  userId: string,
  contactId: string,
  firstMessage: string
) {
  const chatId = await db.transaction(async (tx) => {
    const attemptedInsert = tx
      .insert(chatInstances)
      // @ts-expect-error Null userId is handled by the trigger in pg
      .values({ ownerId: userId, contactId: contactId })
      .onConflictDoNothing()
      .returning({ chatId: chatInstances.chatId });
    const idQuery = tx
      .select({ chatId: chatInstances.chatId })
      .from(chatInstances)
      .where(
        and(
          eq(chatInstances.ownerId, userId),
          eq(chatInstances.contactId, contactId)
        )
      );
    const [chat] = await unionAll(idQuery, attemptedInsert);

    if (!chat?.chatId) return false;
    const insertMessage = await tx
      .insert(messages)
      .values({ text: firstMessage, chatId: chat.chatId, userId });
    if (!insertMessage.rowCount) return false;
    return chat.chatId;
  });

  return chatId;
}
