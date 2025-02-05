import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getRoom, getRoomHandler } from "./rooms.$roomName";
import { getPosts, getPostsHandler } from "./rooms.$roomName.posts";
import { subscribe, subscribeHandler } from "./rooms.$roomName.subscribe";
import { createRoom, createRoomHandler } from "./rooms.index";

export const roomsRouter = createRouter<AppBindingsWithUser>()
  .openapi(subscribe, subscribeHandler)
  .openapi(createRoom, createRoomHandler)
  .openapi(getRoom, getRoomHandler)
  .openapi(getPosts, getPostsHandler);
