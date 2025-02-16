import { createRoute, z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { messages } from "../../db/schema";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { insertMessageSchema } from "../../types/zod-schemas";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["chats"];

export const sendMessage = createRoute({
  path: "/messages",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertMessageSchema, "The text message."),
  },
  responses: {
    [OK]: jsonContent(
      z.union([
        z.object({ text: z.string() }),
        z.object({ chatId: z.number() }),
      ]),
      "The message sent."
    ),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertMessageSchema),
  },
});

export const sendMessageHandler: AppRouteHandler<
  typeof sendMessage,
  AppBindingsWithUser
> = async (c) => {
  const { text, receiverId, chatId } = c.req.valid("json");
  const { id: userId } = c.var.user;
  if (chatId) {
    const message = await insertMessage(chatId, userId, receiverId, text);
    if (!message)
      return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
    return c.json({ text: message }, OK);
  }

  const newChatId = await createChatInstance(userId, receiverId, text);
  if (!newChatId)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(newChatId, OK);
};

async function insertMessage(
  chatId: number,
  userId: string,
  receiverId: string,
  text: string
) {
  const [message] = await db
    .insert(messages)
    .values({ text, senderId: userId, receiverId, chatId })
    .returning({ text: messages.text });

  return message?.text;
}

async function createChatInstance(
  userId: string,
  contactId: string,
  firstMessage: string
) {
  const query = await db.execute<{
    chatId: number;
  }>(sql`
    WITH insert_attempt AS (
      INSERT INTO "chatInstances" ("ownerId", "contactId")
      VALUES (${userId}, ${contactId})
      ON CONFLICT ("ownerId", "contactId") DO NOTHING 
      RETURNING "chatId"
    ),
    chat_id AS (
      SELECT * FROM insert_attempt
    UNION ALL
    SELECT "chatId" FROM "chatInstances"
    WHERE "ownerId" = ${userId} AND "contactId" = ${contactId}
    )
    INSERT INTO messages ("chatId", "senderId", "receiverId", "text") 
      VALUES ((SELECT "chatId" FROM chat_id),${userId}, ${contactId}, ${firstMessage})
      RETURNING "chatId";`);

  return query.rows[0];
}
