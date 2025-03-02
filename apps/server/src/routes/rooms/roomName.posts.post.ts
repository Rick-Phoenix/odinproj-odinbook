import { inputErrorResponse, internalServerError } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { getTableColumns } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { posts } from "../../db/schema";
import { basicPostSchema, insertPostSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts"];

const inputs = {
  params: z.object({ roomName: z.string() }),
  body: jsonContentRequired(insertPostSchema, "The title and content of the post."),
};

export const createPost = createRoute({
  path: "/{roomName}/posts",
  method: "post",
  tags,
  request: inputs,
  responses: {
    [OK]: jsonContent(basicPostSchema, "The newly created post."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertPostSchema),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const createPostHandler: AppRouteHandler<typeof createPost, AppBindingsWithUser> = async (
  c
) => {
  const { id: userId, username } = c.var.user;
  const { roomName } = c.req.valid("param");
  const { title, text } = c.req.valid("json");

  const post = await insertPost(userId, username, roomName, title, text);
  if (!post) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(post, OK);
};

async function insertPost(
  authorId: string,
  authorUsername: string,
  room: string,
  title: string,
  text: string
) {
  const [post] = await db
    .insert(posts)
    .values({ authorId, room, title, text })
    .returning({
      ...getTableColumns(posts),
    });

  if (post) return { ...post, isLiked: true, author: authorUsername };

  return post;
}
