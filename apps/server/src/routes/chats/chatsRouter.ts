import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import {
  getChat,
  getChatHandler,
  postMessage,
  postMessageHandler,
} from "./$chatId";
import {
  chatsIndexHandler,
  createChat,
  createChatHandler,
  getChats,
} from "./chatsIndex";

export const chatRouter = createRouter<AppBindingsWithUser>()
  .openapi(getChats, chatsIndexHandler)
  .openapi(postMessage, postMessageHandler)
  .openapi(getChat, getChatHandler)
  .openapi(createChat, createChatHandler);
