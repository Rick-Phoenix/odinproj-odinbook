import { sql } from "drizzle-orm";
import type { BasicPost } from "../types/zod-schemas";
import db from "./dbConfig";

const roomPostsQuery = (
  userId: string,
  room: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
  cursor: number
) => {
  const orderByColumns = {
    createdAt: sql.raw(`"createdAt"`),
    likesCount: sql.raw(`"likesCount"`),
  } as const;

  const safeOrderBy = orderByColumns[orderBy] ?? orderByColumns.createdAt;

  return sql<BasicPost[]>`SELECT
  *,
  (
    SELECT DISTINCT
      username
    FROM
      users
    WHERE
      users.id = posts."authorId"
  ) AS author, EXISTS (
            SELECT 1
            FROM likes
            WHERE likes."postId" = posts.id
            AND likes."userId" = ${userId}
          ) AS isLiked
FROM
  posts
WHERE
  posts.room = ${room} ORDER BY posts.${safeOrderBy} DESC
LIMIT 20 OFFSET ${cursor * 20}::int`;
};

const t = await db.execute(
  roomPostsQuery(
    "967186cc-80df-4bf4-80f1-93e7892db2cb",
    "PC Builders",
    "createdAt",
    0
  )
);
console.log("🚀 ~ t:", t.rows);
