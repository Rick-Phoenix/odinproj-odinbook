import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema, okResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { commentLikes } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts", "comments", "likes"];

const inputs = {
  params: z.object({ commentId: numberParamSchema }),
  query: z.object({ action: z.enum(["add", "remove"]) }),
};

export const registerCommentLike = createRoute({
  path: "/comments/{commentId}/likes",
  method: "patch",
  tags,
  request: inputs,
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params.merge(inputs.query)),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const registerCommentLikeHandler: AppRouteHandler<
  typeof registerCommentLike,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { commentId } = c.req.valid("param");
  const { action } = c.req.valid("query");

  let queryResult;
  if (action === "add") {
    queryResult = await insertCommentLike(userId, commentId);
  } else {
    queryResult = await removeCommentLike(userId, commentId);
  }

  if (!queryResult) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function insertCommentLike(userId: string, commentId: number) {
  const query = await db.insert(commentLikes).values({ userId, commentId });
  return query.rowCount;
}

async function removeCommentLike(userId: string, commentId: number) {
  const query = await db
    .delete(commentLikes)
    .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)));
  return query.rowCount;
}
