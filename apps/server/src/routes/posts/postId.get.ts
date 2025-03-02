import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchPost } from "../../db/queries";
import { notFoundError } from "../../schemas/response-schemas";
import { fullPostSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["posts"];

const inputs = {
  params: z.object({ postId: numberParamSchema }),
};

export const getPost = createRoute({
  path: "/{postId}",
  method: "get",
  tags,
  request: inputs,
  responses: {
    [OK]: jsonContent(fullPostSchema, "The selected post."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostHandler: AppRouteHandler<typeof getPost, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const { postId } = c.req.valid("param");
  const post = await fetchPost(userId, postId);
  if (!post) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(post, OK);
};
