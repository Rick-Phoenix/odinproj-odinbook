import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { fetchPosts, insertPost } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { basicPostSchema, insertPostSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["posts"];

export const getPosts = createRoute({
  path: "/{roomName}/posts",
  method: "get",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    query: z.object({
      orderBy: z.enum(["likesCount", "createdAt"]).default("likesCount"),
      cursorLikes: numberParamSchema,
      cursorTime: z.string(),
    }),
  },
  responses: {
    [OK]: jsonContent(
      z.array(basicPostSchema),
      "0-20 posts belonging to the requested room."
    ),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostsHandler: AppRouteHandler<
  typeof getPosts,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { roomName } = c.req.valid("param");
  const { orderBy, cursorTime, cursorLikes } = c.req.valid("query");

  const posts = await fetchPosts(
    userId,
    roomName,
    orderBy,
    cursorLikes,
    cursorTime
  );
  if (!posts) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(posts, OK);
};

export const createPost = createRoute({
  path: "/{roomName}/posts",
  method: "post",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    body: jsonContentRequired(
      insertPostSchema,
      "The title and content of the post."
    ),
  },
  responses: {
    [OK]: jsonContent(basicPostSchema, "The newly created post."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertPostSchema),
  },
});

export const createPostHandler: AppRouteHandler<
  typeof createPost,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId, username } = c.var.user;
  const { roomName } = c.req.valid("param");
  const { title, text } = c.req.valid("json");

  const post = await insertPost(userId, username, roomName, title, text);
  return c.json(post, OK);
};
