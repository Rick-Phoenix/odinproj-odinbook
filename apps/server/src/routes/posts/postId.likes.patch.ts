import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { removePostLike } from "../../db/queries";
import { postLikes } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts", "likes"];

const inputs = {
  params: z.object({ postId: numberParamSchema }),
  query: z.object({ action: z.enum(["add", "remove"]) }),
};

export const registerLike = createRoute({
  path: "/{postId}/likes",
  method: "patch",
  tags,
  request: inputs,
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params.merge(inputs.query)),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const registerLikeHandler: AppRouteHandler<
  typeof registerLike,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { postId } = c.req.valid("param");
  const { action } = c.req.valid("query");

  let queryResult;
  if (action === "add") {
    queryResult = await insertPostLike(userId, postId);
  } else {
    queryResult = await removePostLike(userId, postId);
  }

  if (!queryResult) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json("OK", OK);
};

export async function insertPostLike(userId: string, postId: number) {
  const query = await db.insert(postLikes).values({ userId, postId });
  return query.rowCount;
}
