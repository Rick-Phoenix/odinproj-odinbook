import { queryOptions, type MutationOptions } from "@tanstack/react-query";
import { api, wsRPC, type Chat } from "./api-client";
import { queryClient } from "./queries/queryClient";

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
      cacheChat(data);
      return data;
    },
  });

type ChatMutationData = { text: string };
type ChatMutationVariables = { text: string; receiverId: string };
export const chatMutationOptions = (
  chatId: number,
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
    });
  },
});

export function cacheChat(chat: Chat) {
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

const chatWebSocket = wsRPC.ws.$ws();

chatWebSocket.addEventListener("message", (e) => {
  const chatId = +e.data;
  queryClient.invalidateQueries({
    queryKey: ["chat", chatId],
    exact: true,
    refetchType: "all",
  });
});
