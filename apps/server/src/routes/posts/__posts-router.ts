import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { registerCommentLike, registerCommentLikeHandler } from "./commentId.likes.patch";
import { deleteComment, deleteCommentHandler } from "./comments.commentId.delete";
import { getFeed, getFeedHandler } from "./feed.data.get";
import { commentReply, commentReplyHandler } from "./postId.comments.post";
import { getPost, getPostHandler } from "./postId.get";
import { registerLike, registerLikeHandler } from "./postId.likes.patch";

export const postsRouter = createRouter<AppBindingsWithUser>()
  .openapi(getPost, getPostHandler)
  .openapi(registerLike, registerLikeHandler)
  .openapi(getFeed, getFeedHandler)
  .openapi(commentReply, commentReplyHandler)
  .openapi(registerCommentLike, registerCommentLikeHandler)
  .openapi(deleteComment, deleteCommentHandler);
