import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchPost } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { fullPostSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";

const tags = ["posts"];

export const getPost = createRoute({
  path: "/post/{postId}",
  method: "get",
  tags,
  request: {
    params: z.object({ postId: numberParamSchema }),
  },
  responses: {
    [OK]: jsonContent(fullPostSchema, "The selected post."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostHandler: AppRouteHandler<
  typeof getPost,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { postId } = c.req.valid("param");
  const post = await fetchPost(userId, postId);
  if (!post) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(post, OK);
};
