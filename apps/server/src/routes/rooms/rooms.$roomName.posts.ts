import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchPosts } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { basicPostSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";

const tags = ["posts"];

export const getPosts = createRoute({
  path: "/{roomName}/posts",
  method: "get",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    query: z.object({
      orderBy: z.enum(["time", "likes"]).default("likes"),
      cursor: numberParamSchema.default(0),
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
  const { orderBy, cursor } = c.req.valid("query");

  const posts = await fetchPosts(userId, roomName, cursor, orderBy);
  if (!posts) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(posts, OK);
};
