import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getChat, getChatHandler } from "./chats.$chatId.get";
import { removeChat, removeChatHandler } from "./chats.delete";
import { sendMessage, sendMessageHandler } from "./chats.messages.post";
import { chatsIndexHandler, getChats } from "./chatsIndex";

export const chatRouter = createRouter<AppBindingsWithUser>()
  .openapi(getChats, chatsIndexHandler)
  .openapi(sendMessage, sendMessageHandler)
  .openapi(getChat, getChatHandler)
  .openapi(sendMessage, sendMessageHandler)
  .openapi(removeChat, removeChatHandler);
