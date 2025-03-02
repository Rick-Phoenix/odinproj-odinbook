import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { chatsIndexHandler, getChats } from "./#chats-index.get";
import { removeChat, removeChatHandler } from "./chatId.delete";
import { getChat, getChatHandler } from "./chatId.get";
import { sendMessage, sendMessageHandler } from "./messages.post";

export const chatRouter = createRouter<AppBindingsWithUser>()
  .openapi(getChats, chatsIndexHandler)
  .openapi(sendMessage, sendMessageHandler)
  .openapi(getChat, getChatHandler)
  .openapi(sendMessage, sendMessageHandler)
  .openapi(removeChat, removeChatHandler);
