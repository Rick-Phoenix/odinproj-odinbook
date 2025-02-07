import { sql } from "drizzle-orm";

export function fetchFeed(
  userId: string,
  cursorLikes: number,
  cursorTime: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) {
  return sql`
   WITH user_subs_posts AS (SELECT posts.* FROM subs INNER JOIN posts ON subs.room = posts.room
      WHERE subs."userId" = ${userId} AND posts."likesCount" <= ${cursorLikes} AND posts."createdAt" < ${cursorTime}
   ORDER BY posts."likesCount" DESC, posts."createdAt"  DESC LIMIT 20 OFFSET 20
   )
   SELECT * FROM user_subs_posts`;
}

// const t = await db.execute(
//   fetchFeed(
//     "967186cc-80df-4bf4-80f1-93e7892db2cb",
//     0,
//     "2025-02-05 15:17:47.590828",
//     "likesCount"
//   )
// );
// console.log("🚀 ~ t:", t.rows);
