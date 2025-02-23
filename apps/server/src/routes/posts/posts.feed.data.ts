import { createRoute, z } from "@hono/zod-openapi";
import { and, desc, eq, lt, lte } from "drizzle-orm";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { posts, rooms, subs, users } from "../../db/schema";
import { postIsLiked } from "../../db/subqueries";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { userFeedSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { notFoundError } from "../../utils/response-schemas";

const tags = ["posts"];

export const getFeed = createRoute({
  path: "/feed/data",
  method: "get",
  tags,
  request: {
    query: z.object({
      orderBy: z.enum(["createdAt", "likesCount"]).default("likesCount"),
      cursorTime: z.string(),
      cursorLikes: numberParamSchema,
    }),
  },
  responses: {
    [OK]: jsonContent(userFeedSchema, "The selected post."),
    [NOT_FOUND]: notFoundError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(userFeedSchema),
  },
});

export const getFeedHandler: AppRouteHandler<typeof getFeed, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const query = c.req.valid("query");
  const { cursorLikes, cursorTime, orderBy } = query;
  const posts = await fetchFeed(userId, cursorLikes, cursorTime, orderBy);
  return c.json(posts, OK);
};

export async function fetchFeed(
  userId: string,
  cursorLikes: number,
  cursorTime: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) {
  const userSubs = db
    .$with("user_feed")
    .as(
      db
        .select({ room: rooms.name })
        .from(subs)
        .innerJoin(rooms, eq(rooms.name, subs.room))
        .where(eq(subs.userId, userId))
    );

  const userFeed = await db
    .with(userSubs)
    .select({
      post: posts,
      author: users.username,
      ...postIsLiked(userId, posts.id),
    })
    .from(userSubs)
    .innerJoin(posts, eq(posts.room, userSubs.room))
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(
      orderBy === "likesCount"
        ? and(lte(posts.likesCount, cursorLikes), lt(posts.createdAt, cursorTime))
        : and(lt(posts.createdAt, cursorTime))
    )
    .orderBy(
      ...(orderBy === "likesCount"
        ? [desc(posts.likesCount), desc(posts.createdAt)]
        : [desc(posts.createdAt), desc(posts.likesCount)])
    )
    .limit(20);

  const parsedFeed = userFeed.map((i) => ({
    ...i.post,
    isLiked: i.isLiked,
    author: i.author,
  }));

  return parsedFeed;
}
