import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { subscribe, subscribeHandler } from "./$roomId.subscribe";
import { getPosts, getPostsHandler } from "./$roomName/$roomId.posts";
import { getPost, getPostHandler } from "./$roomName/$roomId.posts.$postId";
import { getRoom, getRoomHandler } from "./$roomName/$roomName.index";
import { createRoom, createRoomHandler } from "./roomsIndex";

export const roomsRouter = createRouter<AppBindingsWithUser>()
  .openapi(subscribe, subscribeHandler)
  .openapi(createRoom, createRoomHandler)
  .openapi(getRoom, getRoomHandler)
  .openapi(getPosts, getPostsHandler)
  .openapi(getPost, getPostHandler);
