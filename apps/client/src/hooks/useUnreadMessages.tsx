import { useQuery } from "@tanstack/react-query";

export function useUnreadMessages(chatId: number) {
  const { data } = useQuery({ queryKey: ["unreadMessages"], initialData: [] as number[] });
  return data.includes(chatId);
}
