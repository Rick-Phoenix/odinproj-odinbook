import { eq, sql } from "drizzle-orm";
import type { BasicPost, RoomData } from "../types/zod-schemas";
import db from "./dbConfig";
import { posts, rooms, subs } from "./schema";

export const totalPostsFromUserSubs = (userId: string) =>
  db
    .select({
      id: posts.id,
    })
    .from(posts)
    .innerJoin(subs, eq(posts.room, subs.room))
    .innerJoin(rooms, eq(rooms.name, posts.room))
    .where(eq(subs.userId, userId))
    .as("user_subs_posts");

export const subbedRoomsWithPosts = (
  userId: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) => {
  const orderByColumns = {
    createdAt: sql.raw(`"createdAt"`),
    likesCount: sql.raw(`"likesCount"`),
  } as const;

  const safeOrderBy = orderByColumns[orderBy] ?? orderByColumns.likesCount;
  return {
    subsContent: sql<{ rooms: RoomData[]; posts: BasicPost[] }>`(WITH
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
  limited_posts AS (
    SELECT
      posts.id,
      posts.room,
      posts.title,
      posts.text,
      posts."createdAt",
      posts."likesCount",
      users.username AS author,
      EXISTS (
            SELECT 1
            FROM likes
            WHERE likes."postId" = posts.id
            AND likes."userId" = ${userId}
          ) AS isLiked
    FROM
      posts
      LEFT JOIN users ON posts."authorId" = users.id
    WHERE
      posts.room IN (
        SELECT
          name
        FROM
          user_subs
      )
    ORDER BY
      posts."${safeOrderBy}" DESC
    LIMIT
      20
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
      jsonb_agg(
        jsonb_build_object(
          'id',
          limited_posts.id,
          'author',
          limited_posts.author,
          'title',
          limited_posts.title,
          'text',
          limited_posts.text,
          'createdAt',
          limited_posts."createdAt",
          'likesCount',
          limited_posts."likesCount",
          'isLiked', 
          limited_posts.isLiked
        )
      ) AS posts
    FROM
      limited_posts
  )
SELECT
  jsonb_build_object('rooms', rooms_json.rooms, 'posts', posts_json.posts) AS result
FROM
  rooms_json,
  posts_json)`.as("subsContent"),
  };
};
