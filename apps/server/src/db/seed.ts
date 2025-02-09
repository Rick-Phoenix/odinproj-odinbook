import { sql } from "drizzle-orm";

export function fetchFeed(
  userId: string,
  cursorLikes: number,
  cursorTime: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) {
  return sql`
(WITH
  user_subs AS (
    SELECT DISTINCT
      rooms.name,
      rooms."createdAt",
      rooms.category,
      rooms.avatar,
      rooms.description,
      rooms."subsCount",
      users.id,
      users.username
    FROM
      subs
      INNER JOIN rooms ON subs.room = rooms.name
      INNER JOIN users ON subs."userId" = users.id
    WHERE
      users.id = ${userId}
  ),
  recent_posts AS (
    SELECT 
      posts.id,
      posts.room,
      posts.title,
      posts.text,
      posts."createdAt",
      posts."likesCount",
      users.username AS author,
      EXISTS (
        SELECT 1 FROM likes 
        WHERE likes."postId" = posts.id 
        AND likes."userId" = ${userId}
      ) AS isLiked
    FROM posts
    LEFT JOIN users ON posts."authorId" = users.id
    WHERE posts.room IN (SELECT name FROM user_subs)
    ORDER BY posts."createdAt" DESC
    LIMIT 20
  ),
   liked_posts AS (
    SELECT 
      posts.id,
      posts.room,
      posts.title,
      posts.text,
      posts."createdAt",
      posts."likesCount",
      users.username AS author,
      EXISTS (
        SELECT 1 FROM likes 
        WHERE likes."postId" = posts.id 
        AND likes."userId" = ${userId}
      ) AS isLiked
    FROM posts
    LEFT JOIN users ON posts."authorId" = users.id
    WHERE posts.room IN (SELECT name FROM user_subs)
    ORDER BY posts."likesCount" DESC
    LIMIT 20
  ),
    combined_posts AS (
    SELECT * FROM recent_posts
    UNION ALL
    SELECT * FROM liked_posts
  ),
  unique_posts AS (
    SELECT * FROM (
      SELECT DISTINCT ON (id) 
        id, 
        room, 
        title, 
        text, 
        "createdAt", 
        "likesCount", 
        author, 
        isLiked
      FROM combined_posts
      ORDER BY id 
    ) AS unique_posts
    ORDER BY "likesCount" DESC, "createdAt" DESC
  ),
  suggested_rooms AS (
    SELECT * FROM rooms r WHERE r.category IN (SELECT r.category
    FROM subs s
    JOIN rooms r ON s.room = r.name
    WHERE s."userId" = ${userId}
    GROUP BY r.category
    ORDER BY COUNT(*) DESC
    LIMIT 1) ORDER BY r."subsCount" DESC LIMIT 5
  ),
  rooms_json AS (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'name',
          user_subs.name,
          'createdAt',
          user_subs."createdAt",
          'category',
          user_subs.category,
          'avatar',
          user_subs.avatar,
          'description',
          user_subs.description,
          'subsCount',
          user_subs."subsCount",
          'isSubscribed',
          'true'::boolean
        )
      ) AS rooms
    FROM
      user_subs 
  ),
  suggested_rooms_json AS (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'name',
          suggested_rooms.name,
          'createdAt',
          suggested_rooms."createdAt",
          'category',
          suggested_rooms.category,
          'avatar',
          suggested_rooms.avatar,
          'description',
          suggested_rooms.description,
          'subsCount',
          suggested_rooms."subsCount",
          'isSubscribed',
          'true'::boolean
        )
      ) AS suggested_rooms
    FROM
      suggested_rooms 
  ),
  posts_json AS (
    SELECT 
      jsonb_agg(jsonb_build_object(
        'id', unique_posts.id,
        'author', unique_posts.author,
        'title', unique_posts.title,
        'text', unique_posts.text,
        'createdAt', unique_posts."createdAt",
        'likesCount', unique_posts."likesCount",
        'room', unique_posts.room,
        'isLiked', unique_posts.isLiked
      )) AS posts
    FROM unique_posts 
  )
SELECT
  jsonb_build_object('rooms', rooms_json.rooms, 'posts', posts_json.posts, 'suggestedRooms', suggested_rooms_json.suggested_rooms) AS result
FROM
  rooms_json,
  posts_json,
  suggested_rooms_json
  )
`;
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
