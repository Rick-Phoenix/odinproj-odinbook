import { createRoute, z } from "@hono/zod-openapi";
import { and, lt, lte, notInArray, sql } from "drizzle-orm";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { lowercase } from "../../db/db-methods";
import db from "../../db/dbConfig";
import { insertPost } from "../../db/queries";
import { isSubscribed, postIsLiked, totalPostsFromRoom } from "../../db/subqueries";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { basicPostSchema, insertPostSchema, roomWithPostsSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { notFoundError } from "../../utils/response-schemas";

const tags = ["posts"];

export const getPosts = createRoute({
  path: "/{roomName}/posts",
  method: "get",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    query: z
      .object({
        orderBy: z.enum(["likesCount", "createdAt"]).default("likesCount"),
        cursorLikes: numberParamSchema,
        cursorTime: z.string(),
        excludeIds: z.array(z.coerce.number()),
      })
      .partial(),
  },
  responses: {
    [OK]: jsonContent(roomWithPostsSchema, "The room data with 0-20 posts."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostsHandler: AppRouteHandler<typeof getPosts, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const { roomName } = c.req.valid("param");
  const { orderBy, cursorTime, cursorLikes, excludeIds } = c.req.valid("query");

  const posts = await fetchRoomPosts(
    userId,
    roomName,
    orderBy,
    cursorLikes,
    cursorTime,
    excludeIds
  );
  if (!posts) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(posts, OK);
};

export async function fetchRoomPosts(
  userId: string,
  roomName: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
  cursorLikes?: number,
  cursorTime: string = new Date().toISOString(),
  excludeIds: number[] = []
) {
  const room = await db.query.rooms.findFirst({
    where: (room, { eq }) => eq(lowercase(room.name), roomName.toLocaleLowerCase()),
    with: {
      posts: {
        limit: 20,
        with: { author: { columns: { username: true } } },
        orderBy: (post, { desc }) =>
          orderBy === "likesCount"
            ? [desc(post.likesCount), desc(post.createdAt)]
            : [desc(post.createdAt), desc(post.likesCount)],
        extras: (f) => postIsLiked(userId, f.id),
        where: (f) =>
          !cursorLikes
            ? and(lt(f.createdAt, cursorTime), notInArray(f.id, excludeIds))
            : and(
                lt(f.createdAt, cursorTime),
                lte(f.likesCount, cursorLikes),
                notInArray(f.id, excludeIds)
              ),
      },
    },
    extras: (f) => ({
      ...isSubscribed(userId, f.name),
      totalPosts: sql<number>`${db.$count(totalPostsFromRoom(roomName))}::int`
        .mapWith(Number)
        .as("totalPosts"),
    }),
  });

  if (room)
    return {
      ...room,
      posts: room.posts.map((post) => ({
        ...post,
        author: post.author.username,
      })),
    };

  return room;
}

export const createPost = createRoute({
  path: "/{roomName}/posts",
  method: "post",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    body: jsonContentRequired(insertPostSchema, "The title and content of the post."),
  },
  responses: {
    [OK]: jsonContent(basicPostSchema, "The newly created post."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertPostSchema),
  },
});

export const createPostHandler: AppRouteHandler<typeof createPost, AppBindingsWithUser> = async (
  c
) => {
  const { id: userId, username } = c.var.user;
  const { roomName } = c.req.valid("param");
  const { title, text } = c.req.valid("json");

  const post = await insertPost(userId, username, roomName, title, text);
  return c.json(post, OK);
};
