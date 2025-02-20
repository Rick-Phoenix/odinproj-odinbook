import { eq, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import type { BasicPost, RoomData } from "../types/zod-schemas";
import db from "./dbConfig";
import { listings, postLikes, posts, rooms, subs } from "./schema";

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

export const userStats = (userId: string) => {
  const likesQuery = db
    .select()
    .from(postLikes)
    .where(eq(postLikes.userId, userId))
    .as("totalLikes");
  const postsQuery = db.select().from(posts).where(eq(posts.authorId, userId)).as("totalPosts");
  const roomsQuery = db.select().from(rooms).where(eq(rooms.creatorId, userId)).as("totalRooms");
  const listingsQuery = db
    .select()
    .from(listings)
    .where(eq(listings.sellerId, userId))
    .as("totalListings");
  return {
    totalLikes: sql<number>`${db.$count(likesQuery)}::int`.mapWith(Number).as("totalLikes"),
    totalPosts: sql<number>`${db.$count(postsQuery)}::int`.mapWith(Number).as("totalPosts"),
    totalRoomsCreated: sql<number>`${db.$count(roomsQuery)}::int`
      .mapWith(Number)
      .as("totalRoomsCreated"),
    totalListings: sql<number>`${db.$count(listingsQuery)}::int`
      .mapWith(Number)
      .as("totalListings"),
  };
};
export const totalPostsFromRoom = (room: string) =>
  db
    .select()
    .from(posts)
    .innerJoin(rooms, eq(rooms.name, posts.room))
    .where(eq(rooms.name, room))
    .as("room_posts");

export const initialFeedQuery = (userId: string) => {
  return {
    subsContent: sql<{
      rooms: RoomData[];
      posts: BasicPost[];
      suggestedRooms: RoomData[];
    }>`(WITH
  user_subs AS (
    SELECT DISTINCT
      rooms.*
    FROM
      subs
      INNER JOIN rooms ON subs.room = rooms.name
    WHERE
      subs."userId" = ${userId}
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
      AND r.name NOT IN (SELECT name FROM user_subs) AND r."creatorId" != ${userId}
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
      UNION 
      SELECT * FROM recent_posts
      ORDER BY "likesCount" DESC, "createdAt" DESC
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
  )`.as("subsContent"),
  };
};

export function postIsLiked(userId: string, postId: PgColumn) {
  return {
    isLiked: sql<boolean>`
      EXISTS (
        SELECT
          1
        FROM
          "postLikes"
        WHERE
          "postLikes"."postId" = ${postId}
          AND "postLikes"."userId" = ${userId}
      )
    `.as("isLiked"),
  };
}

export function commentIsLiked(userId: string, commentId: PgColumn) {
  return {
    isLiked: sql<boolean>`
      EXISTS (
        SELECT
          1
        FROM
          "commentLikes"
        WHERE
          "commentLikes"."commentId" = ${commentId}
          AND "commentLikes"."userId" = ${userId}
      )
    `.as("isLiked"),
  };
}

export function isSaved(userId: string, listingId: PgColumn) {
  return {
    isSaved: sql<boolean>`
      EXISTS (
        SELECT
          1
        FROM
          "savedListings"
        WHERE
          "listingId" = ${listingId}
          AND "userId" = ${userId}
      )
    `.as("isSaved"),
  };
}

export function isSubscribed(userId: string, roomName: PgColumn) {
  return {
    isSubscribed: sql<boolean>`
      EXISTS (
        SELECT
          1
        FROM
          "subs"
        WHERE
          "subs"."room" = ${roomName}
          AND "subs"."userId" = ${userId}
      )
    `.as("isSubscribed"),
  };
}
