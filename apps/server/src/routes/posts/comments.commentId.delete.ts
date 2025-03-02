import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { comments } from "../../db/schema";
import { internalServerError, okResponse } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts", "comments"];

const inputs = z.object({ commentId: numberParamSchema });

export const deleteComment = createRoute({
  path: "/comments/{commentId}",
  method: "delete",
  tags,
  request: {
    params: inputs,
  },
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const deleteCommentHandler: AppRouteHandler<
  typeof deleteComment,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { commentId } = c.req.valid("param");
  const removal = await softDeleteComment(userId, commentId);
  if (!removal) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function softDeleteComment(userId: string, commentId: number) {
  const query = await db
    .update(comments)
    .set({ isDeleted: true, text: "This comment has been deleted by its author." })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
  return query.rowCount;
}
