import { queryOptions, type MutationOptions } from "@tanstack/react-query";
import { api, wsRPC, type Chat, type Message } from "../api-client";
import { queryClient } from "./queryClient";

export const chatsQueryOptions = {
  queryKey: ["chats"],
  queryFn: async () => {
    const res = await api.chats.$get();
    const data = await res.json();
    if ("issues" in data) throw Error("Error while loading the chats.");
    if (data.length)
      for (const chat of data) {
        cacheChat(chat);
      }
    return data;
  },
};

export const singleChatQueryOptions = (chatId: number) =>
  queryOptions({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await api.chats[":chatId"].$get({ param: { chatId } });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("An error occurred while loading the chat.");
      }
      return data;
    },
  });

type ChatMutationData = { text: string };
type ChatMutationVariables = { text: string; receiverId: string };
export const chatMutationOptions = (
  chatId: number
): MutationOptions<ChatMutationData, Error, ChatMutationVariables> => ({
  mutationKey: ["chat", chatId],
  mutationFn: async (inputs: { text: string; receiverId: string }) => {
    const { text, receiverId } = inputs;
    const res = await api.chats.messages.$post({
      json: { text, receiverId, chatId },
    });
    const resData = await res.json();
    if ("issues" in resData || !("text" in resData)) {
      throw new Error("An error occurred while sending a message.");
    }
    return resData;
  },
  onSuccess: (d, inputs) => {
    chatWebSocket.send(JSON.stringify({ receiver: inputs.receiverId, chatId }));

    queryClient.invalidateQueries({
      queryKey: ["chat", chatId],
      exact: true,
      refetchType: "all",
    });
  },
});

const markAsUnread = (chatId: number) =>
  queryClient.setQueryData(["unreadMessages"], (old: number[] | undefined) =>
    old ? [...old, chatId] : [chatId]
  );
function markUnreadMessages(
  chatId: number,
  lastMessage: Message | undefined,
  lastRead: string | null
) {
  if (!lastMessage) return;
  if (lastRead) {
    const lastReadTime = new Date(lastRead);
    const lastMessageTime = new Date(lastMessage.createdAt);
    if (lastMessageTime > lastReadTime) return markAsUnread(chatId);
  }

  const lastReadMessageId = Number(localStorage.getItem(`lastMessageRead-${chatId}`));
  if (lastReadMessageId < lastMessage.id) markAsUnread(chatId);
}

export function cacheChat(chat: Chat) {
  markUnreadMessages(chat.id, chat.messages.at(-1), chat.lastRead);

  queryClient.setQueryDefaults(["chat", chat.id], {
    queryFn: async () => {
      const res = await api.chats[":chatId"].$get({
        param: { chatId: chat.id },
      });
      const data = await res.json();
      if ("issues" in data) throw new Error("Chat not found.");
      return data;
    },
  });

  queryClient.setQueryData(["chat", chat.id], chat);
}

export const chatWebSocket = wsRPC.ws.$ws();

chatWebSocket.addEventListener("message", async (e) => {
  const chatId = +e.data;
  const existingChat = queryClient.getQueryData(["chat", chatId]);
  if (!existingChat) {
    await queryClient.fetchQuery(singleChatQueryOptions(chatId));
  } else {
    queryClient.invalidateQueries({
      queryKey: ["chat", chatId],
      exact: true,
      refetchType: "all",
    });
  }

  const [, section, currentChatId] = location.pathname.split("/");
  if (section.toLowerCase() !== "chats" || +currentChatId !== chatId) {
    queryClient.setQueryData(["unreadMessages"], (old: number[] | undefined) =>
      old ? [...old, chatId] : [chatId]
    );
  }
});
