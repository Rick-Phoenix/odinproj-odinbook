import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { insertComment } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { commentSchema } from "../../types/zod-schemas";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["posts", "comments"];

export const commentReply = createRoute({
  path: "/{postId}/comments",
  method: "post",
  tags,
  request: {
    params: z.object({ postId: numberParamSchema }),
    body: jsonContent(
      z.object({ text: z.string(), parentCommentId: z.number().optional() }),
      "The text for the reply."
    ),
  },
  responses: {
    [OK]: jsonContent(commentSchema, "The new comment created."),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const commentReplyHandler: AppRouteHandler<
  typeof commentReply,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId, username, avatarUrl } = c.var.user;
  const { postId } = c.req.valid("param");
  const { text, parentCommentId } = c.req.valid("json");
  const comment = await insertComment(userId, postId, text, parentCommentId);
  const withAuthor = { ...comment, author: { username, avatarUrl } };
  return c.json(withAuthor, OK);
};
