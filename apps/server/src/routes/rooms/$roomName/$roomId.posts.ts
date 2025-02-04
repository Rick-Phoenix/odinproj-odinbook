import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchPosts } from "../../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../../types/app-bindings";
import { numberParamSchema } from "../../../types/schema-helpers";
import { basicPostSchema } from "../../../types/zod-schemas";
import { notFoundError } from "../../../utils/customErrors";

const tags = ["posts"];

export const getPosts = createRoute({
  path: "/{roomId}/posts",
  method: "get",
  tags,
  request: {
    params: z.object({ roomId: numberParamSchema }),
    query: z.object({
      orderBy: z.enum(["time", "likes"]).default("likes"),
      cursor: numberParamSchema.default(0),
    }),
  },
  responses: {
    [OK]: jsonContent(z.array(basicPostSchema), "The room with posts."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getPostsHandler: AppRouteHandler<
  typeof getPosts,
  AppBindingsWithUser
> = async (c) => {
  const { roomId } = c.req.valid("param");
  const { orderBy, cursor } = c.req.valid("query");

  const posts = await fetchPosts(roomId, cursor, orderBy);
  if (!posts) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(posts, OK);
};
