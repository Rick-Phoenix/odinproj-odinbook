import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { createRoom, createRoomHandler } from "./#rooms-index.post";
import { deleteRoom, deleteRoomHandler } from "./roomName.delete";
import { getPosts, getPostsHandler } from "./roomName.posts.get";
import { createPost, createPostHandler } from "./roomName.posts.post";
import { subscribe, subscribeHandler } from "./roomName.subscriptions.patch";

export const roomsRouter = createRouter<AppBindingsWithUser>()
  .openapi(subscribe, subscribeHandler)
  .openapi(createRoom, createRoomHandler)
  .openapi(getPosts, getPostsHandler)
  .openapi(createPost, createPostHandler)
  .openapi(deleteRoom, deleteRoomHandler);
