import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { insertCommentLike, removeCommentLike } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { internalServerError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";

const tags = ["posts", "comments", "likes"];

export const registerCommentLike = createRoute({
  path: "/comments/{commentId}/like",
  method: "post",
  tags,
  request: {
    params: z.object({ commentId: numberParamSchema }),
    query: z.object({ action: z.enum(["add", "remove"]) }),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const registerCommentLikeHandler: AppRouteHandler<
  typeof registerCommentLike,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { commentId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  if (action === "add") {
    await insertCommentLike(userId, commentId);
  } else {
    await removeCommentLike(userId, commentId);
  }

  return c.json("OK", OK);
};
