import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchFeed } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { basicPostSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";

const tags = ["posts"];

export const getFeed = createRoute({
  path: "/feed",
  method: "get",
  tags,
  request: {
    params: z.object({ postId: numberParamSchema }),
    query: z.object({
      orderBy: z.enum(["time", "likes"]).default("likes"),
      cursor: numberParamSchema.default(0),
    }),
  },
  responses: {
    [OK]: jsonContent(z.array(basicPostSchema), "The selected post."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getFeedHandler: AppRouteHandler<
  typeof getFeed,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { orderBy, cursor } = c.req.valid("query");
  const posts = await fetchFeed(userId, cursor, orderBy);
  return c.json(posts, OK);
};
