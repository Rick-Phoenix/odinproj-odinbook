import { singleChatQueryOptions } from "@/lib/chatQueries";
import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "../../../components/custom/Chat";

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

  return <ChatPage chatId={chatId} />;
}
