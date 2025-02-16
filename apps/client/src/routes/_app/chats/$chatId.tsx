import { singleChatQueryOptions } from "@/lib/chatQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "../../../components/custom/Chat";
import { type Chat } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/chats/$chatId")({
  component: RouteComponent,
  params: {
    parse: ({ chatId }) => {
      return { chatId: +chatId };
    },
  },
  loader: async ({ context: { queryClient }, params: { chatId } }) => {
    return await queryClient.fetchQuery(singleChatQueryOptions(chatId));
  },
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { data: chat } = useSuspenseQuery<Chat>({
    queryKey: ["chat", chatId],
  });
  return (
    <>
      {chat && (
        <ChatPage
          contactName={chat.contact.username}
          contactAvatar={chat.contact.avatarUrl}
          contactId={chat.contact.id}
          messages={chat.messages}
          chatId={chat.id}
        />
      )}
    </>
  );
}
