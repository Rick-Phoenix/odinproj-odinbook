import { sql } from "drizzle-orm";
import db from "./dbConfig";

async function createChatInstance(
  userId: string,
  contactId: string,
  firstMessage: string
) {
  const query = await db.execute<{
    chatId: number;
    text: string;
  }>(sql`WITH insert_attempt AS (
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
      RETURNING "chatId", "text";`);

  return query.rows[0];
}

const a = await createChatInstance("16", "15", "hello");
console.log("🚀 ~ a:", a);
