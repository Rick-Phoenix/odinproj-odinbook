import { api, type Chat, wsRPC } from "./api-client";
import { queryClient } from "./queries/queryClient";

export const chatsQueryOptions = {
  queryKey: ["chats"],
  queryFn: async () => {
    const res = await api.chats.$get();
    const data = await res.json();
    if ("issues" in data) throw Error("Server Error");
    if (data.length > 0)
      for (const chat of data) {
        cacheChat(chat);
      }
    return data;
  },
};
export function cacheChat(chat: Chat) {
  queryClient.setMutationDefaults(["chat", chat.id], {
    mutationFn: async ({ text }: { text: string }) => {
      const res = await api.chats[":chatId"].$post({
        param: { chatId: chat.id },
        json: { text },
      });
      const resData = await res.json();
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return;
    },
    onSuccess: () => {
      chatWebSocket.send(
        JSON.stringify({ receiver: chat.contact.id, chatId: chat.id }),
      );
      queryClient.invalidateQueries({
        queryKey: ["chat", chat.id],
        exact: true,
      });
    },
  });

  queryClient.setQueryDefaults(["chat", chat.id], {
    gcTime: Infinity,
    staleTime: Infinity,
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
chatWebSocket.addEventListener("message", (e) => {
  const chatId = +e.data;
  queryClient.invalidateQueries({
    queryKey: ["chat", chatId],
    exact: true,
  });
});
