import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchFeed } from "../../db/queries";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { userFeedSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { notFoundError } from "../../utils/response-schemas";

const tags = ["posts"];

export const getFeed = createRoute({
  path: "/feed/data",
  method: "get",
  tags,
  request: {
    query: z.object({
      orderBy: z.enum(["createdAt", "likesCount"]).default("likesCount"),
      cursorTime: z.string(),
      cursorLikes: numberParamSchema,
    }),
  },
  responses: {
    [OK]: jsonContent(userFeedSchema, "The selected post."),
    [NOT_FOUND]: notFoundError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(userFeedSchema),
  },
});

export const getFeedHandler: AppRouteHandler<typeof getFeed, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const query = c.req.valid("query");
  const { cursorLikes, cursorTime, orderBy } = query;
  const posts = await fetchFeed(userId, cursorLikes, cursorTime, orderBy);
  return c.json(posts, OK);
};
