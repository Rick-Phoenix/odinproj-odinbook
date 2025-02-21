import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { deleteRoom, deleteRoomHandler } from "./rooms.$roomName.delete";
import { createPost, createPostHandler, getPosts, getPostsHandler } from "./rooms.$roomName.posts";
import { subscribe, subscribeHandler } from "./rooms.$roomName.subscribe";
import { createRoom, createRoomHandler } from "./rooms.index";

export const roomsRouter = createRouter<AppBindingsWithUser>()
  .openapi(subscribe, subscribeHandler)
  .openapi(createRoom, createRoomHandler)
  .openapi(getPosts, getPostsHandler)
  .openapi(createPost, createPostHandler)
  .openapi(deleteRoom, deleteRoomHandler);
