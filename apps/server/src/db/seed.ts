import { sql } from "drizzle-orm";
import db from "./dbConfig";

export const initialFeedQuery = async (userId: string) => {
  return await db.execute(sql`(WITH
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
  selected_rooms AS (
  SELECT name FROM user_subs
  UNION ALL
  SELECT * FROM (  
    SELECT name 
    FROM rooms 
    ORDER BY "subsCount" DESC 
    LIMIT 5
  ) AS fallback
  WHERE NOT EXISTS (SELECT 1 FROM user_subs)
  ),
    top_category AS (
    SELECT category
    FROM user_subs
    GROUP BY category
    ORDER BY COUNT(*) DESC
    LIMIT 1
  ),
  suggested_rooms AS (
    SELECT * 
    FROM rooms r 
    WHERE 
      (
        r.category IN (SELECT category FROM top_category) 
        OR (SELECT category FROM top_category) IS NULL
      )
      AND r.name NOT IN (SELECT name FROM user_subs)
    ORDER BY r."subsCount" DESC 
    LIMIT 5
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
        SELECT 1 FROM "postLikes" 
        WHERE "postLikes"."postId" = posts.id 
        AND "postLikes"."userId" = ${userId}
      ) AS isLiked
    FROM posts
    LEFT JOIN users ON posts."authorId" = users.id
    WHERE posts.room IN (SELECT name FROM selected_rooms)
    ORDER BY posts."likesCount" DESC
    LIMIT 20
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
        SELECT 1 FROM "postLikes" 
        WHERE "postLikes"."postId" = posts.id 
        AND "postLikes"."userId" = ${userId}
      ) AS isLiked
    FROM posts
    LEFT JOIN users ON posts."authorId" = users.id
    WHERE posts.room IN (SELECT name FROM selected_rooms)
    ORDER BY posts."createdAt" DESC
    LIMIT 20
  ),
    combined_posts AS (
      SELECT * FROM liked_posts
      UNION ALL
      SELECT * FROM recent_posts
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
        'id', combined_posts.id,
        'author', combined_posts.author,
        'title', combined_posts.title,
        'text', combined_posts.text,
        'createdAt', combined_posts."createdAt",
        'likesCount', combined_posts."likesCount",
        'room', combined_posts.room,
        'isLiked', combined_posts.isLiked
      )) AS posts
    FROM combined_posts 
  )
SELECT
  jsonb_build_object('rooms', rooms_json.rooms, 'posts', posts_json.posts, 'suggestedRooms', suggested_rooms_json.suggested_rooms) AS result
FROM
  rooms_json,
  posts_json,
  suggested_rooms_json
  )`);
};
