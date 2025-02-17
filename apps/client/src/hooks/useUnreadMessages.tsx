import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import useReactiveLocalStorage from "./useReactiveLocalStorage";

export function useUnreadMessages(chatId: number, lastMessageId: number) {
  const [lastMessageRead] = useReactiveLocalStorage(`lastMessageRead-${chatId}`);
  const lastMessageReadId = Number(lastMessageRead);
  const hasUnreadMessages = lastMessageReadId < lastMessageId;
  const queryClient = useQueryClient();
  const currentOpenChat = useParams({ from: "/_app/chats/$chatId", shouldThrow: false });

  if (hasUnreadMessages && currentOpenChat?.chatId !== chatId) {
    queryClient.setQueryData(["unreadMessages"], (old: number[] | undefined) =>
      old ? [...old, chatId] : [chatId]
    );
  }
  return hasUnreadMessages;
}
