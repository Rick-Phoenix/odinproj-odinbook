import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { insertPostLike, removePostLike } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { getUserId } from "../../utils/getters";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["posts", "likes"];

export const registerLike = createRoute({
  path: "/{postId}/like",
  method: "post",
  tags,
  request: {
    params: z.object({ postId: numberParamSchema }),
    query: z.object({ action: z.enum(["add", "remove"]) }),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const registerLikeHandler: AppRouteHandler<
  typeof registerLike,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { postId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  if (action === "add") {
    await insertPostLike(userId, postId);
  } else {
    await removePostLike(userId, postId);
  }

  return c.json("OK", OK);
};
