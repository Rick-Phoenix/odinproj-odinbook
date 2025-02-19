import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { commentReply, commentReplyHandler } from "./posts.$postId.comments";
import { registerLike, registerLikeHandler } from "./posts.$postId.like";
import { registerCommentLike, registerCommentLikeHandler } from "./posts.comments.$commentId.like";
import { deleteComment, deleteCommentHandler } from "./posts.comments.delete";
import { getFeed, getFeedHandler } from "./posts.feed.data";
import { getPost, getPostHandler } from "./posts.post.$postId";

export const postsRouter = createRouter<AppBindingsWithUser>()
  .openapi(getPost, getPostHandler)
  .openapi(registerLike, registerLikeHandler)
  .openapi(getFeed, getFeedHandler)
  .openapi(commentReply, commentReplyHandler)
  .openapi(registerCommentLike, registerCommentLikeHandler)
  .openapi(deleteComment, deleteCommentHandler);
