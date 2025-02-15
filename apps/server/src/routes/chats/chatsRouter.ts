import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getChat, getChatHandler } from "./chats.$chatId.get";
import { removeChat, removeChatHandler } from "./chats.delete";
import { postMessage, postMessageHandler } from "./chats.messages.post";
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
  .openapi(createChat, createChatHandler)
  .openapi(removeChat, removeChatHandler);
