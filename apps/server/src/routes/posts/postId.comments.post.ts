import { inputErrorResponse, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { comments } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import { commentSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts", "comments"];

const inputs = {
  params: z.object({ postId: numberParamSchema }),
  body: z.object({ text: z.string(), parentCommentId: z.number().optional() }),
};

export const commentReply = createRoute({
  path: "/{postId}/comments",
  method: "post",
  tags,
  request: {
    params: inputs.params,
    body: jsonContent(inputs.body, "The text for the reply."),
  },
  responses: {
    [OK]: jsonContent(commentSchema, "The new comment created."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params.merge(inputs.body)),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const commentReplyHandler: AppRouteHandler<
  typeof commentReply,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId, username, avatarUrl } = c.var.user;
  const { postId } = c.req.valid("param");
  const { text, parentCommentId } = c.req.valid("json");
  const comment = await insertComment(userId, postId, text, parentCommentId);
  if (!comment) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  const withAuthor = { ...comment, author: { username, avatarUrl } };
  return c.json(withAuthor, OK);
};

export async function insertComment(
  userId: string,
  postId: number,
  text: string,
  parentCommentId?: number
) {
  const [comment] = await db
    .insert(comments)
    .values({ userId, postId, text, parentCommentId })
    .returning();
  if (!comment) return null;
  return { ...comment, isLiked: true, likesCount: 1 };
}
