import { sql } from "drizzle-orm";
import type { BasicPost } from "../types/zod-schemas";
import db from "./dbConfig";

const roomPostsQuery = (
  userId: string,
  room: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
  cursor: number
) => {
  return sql<BasicPost[]>`(WITH
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
  posts_json AS (
    SELECT 
      jsonb_agg(jsonb_build_object(
        'id', posts.id,
        'author', posts.author,
        'title', posts.title,
        'text', posts.text,
        'createdAt', posts."createdAt",
        'likesCount', posts."likesCount",
        'room', posts.room,
        'isLiked', posts.isLiked
      )) AS posts
    FROM (
      SELECT * FROM recent_posts
      UNION ALL
      SELECT * FROM liked_posts
    ) AS posts
  )
SELECT
  jsonb_build_object('rooms', rooms_json.rooms, 'posts', posts_json.posts) AS result
FROM
  rooms_json,
  posts_json)`;
};

const t = await db.execute(
  roomPostsQuery(
    "967186cc-80df-4bf4-80f1-93e7892db2cb",
    "PC Builders",
    "createdAt",
    0
  )
);
console.log("🚀 ~ t:", t.rows[0].result);
