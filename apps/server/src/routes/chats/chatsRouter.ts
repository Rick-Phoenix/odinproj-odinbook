import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import {
  getChat,
  getChatHandler,
  postMessage,
  postMessageHandler,
} from "./$chatId";
import { chatsIndex, chatsIndexHandler } from "./chatsIndex";

export const chatRouter = createRouter<AppBindingsWithUser>()
  .openapi(chatsIndex, chatsIndexHandler)
  .openapi(postMessage, postMessageHandler)
  .openapi(getChat, getChatHandler);
