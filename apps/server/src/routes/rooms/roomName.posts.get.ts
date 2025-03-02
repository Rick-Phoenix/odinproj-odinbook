import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, lt, lte, sql } from "drizzle-orm";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { lowercase } from "../../db/db-methods";
import { isSubscribed, postIsLiked, totalPostsFromRoom } from "../../db/subqueries";
import { notFoundError } from "../../schemas/response-schemas";
import { roomWithPostsSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts"];

const inputs = {
  params: z.object({ roomName: z.string() }),
  query: z
    .object({
      orderBy: z.enum(["likesCount", "createdAt"]).default("likesCount"),
      cursorLikes: numberParamSchema,
      cursorTime: z.string(),
    })
    .partial(),
};

export const getPosts = createRoute({
  path: "/{roomName}/posts",
  method: "get",
  tags,
  request: inputs,
  responses: {
    [OK]: jsonContent(roomWithPostsSchema, "The room data with 0-20 posts."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params.merge(inputs.query)),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostsHandler: AppRouteHandler<typeof getPosts, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const { roomName } = c.req.valid("param");
  const { orderBy, cursorTime, cursorLikes } = c.req.valid("query");

  const posts = await fetchRoomPosts(userId, roomName, orderBy, cursorLikes, cursorTime);
  if (!posts) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(posts, OK);
};

async function fetchRoomPosts(
  userId: string,
  roomName: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
  cursorLikes?: number,
  cursorTime: string = new Date().toISOString()
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
          cursorLikes === undefined
            ? lt(f.createdAt, cursorTime)
            : and(lt(f.createdAt, cursorTime), lte(f.likesCount, cursorLikes)),
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
