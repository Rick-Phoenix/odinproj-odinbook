import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getPost, getPostHandler } from "./posts.$postId";
import { registerLike, registerLikeHandler } from "./posts.$postId.like";

export const postsRouter = createRouter<AppBindingsWithUser>()
  .openapi(getPost, getPostHandler)
  .openapi(registerLike, registerLikeHandler);
