import type { Chat } from "../lib/db-types";
import { useReactiveQueries } from "./useReactiveQueries";

export function useChats() {
  const chats = useReactiveQueries(["chat"]);
  const sortedChats = chats
    .map((tup) => tup[1] as Chat)
    .sort((a, b) => {
      const lastMessageA = a.messages.at(-1)?.createdAt || 0;
      const lastMessageB = b.messages.at(-1)?.createdAt || 0;
      return new Date(lastMessageA) > new Date(lastMessageB) ? -1 : 1;
    });

  return sortedChats;
}
