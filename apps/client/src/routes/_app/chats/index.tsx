import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SquarePen } from "lucide-react";
import { type FC } from "react";
import InsetScrollArea from "../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import CreateChatDialog from "../../../components/dialogs/CreateChatDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../../components/ui/context-menu";
import { useChats } from "../../../hooks/useChats";
import { useToast } from "../../../hooks/useToast";
import { useUnreadMessages } from "../../../hooks/useUnreadMessages";
import type { Chat, Message } from "../../../lib/db-types";
import { api } from "../../../lib/hono-RPC";
import { chatsQueryOptions } from "../../../lib/queries/chatQueries";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.fetchQuery(chatsQueryOptions);
  },
});

function RouteComponent() {
  const chats = useChats();

  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 auto-rows-max grid-cols-1 grid-rows-[max-content] gap-4 rounded-xl border bg-gray-800/20 p-4">
        <header className="flex h-[5.5rem] w-full items-center justify-between rounded-xl border bg-gray-800 p-4 hover:text-foreground md:h-24 md:p-8">
          <h2 className="text-3xl font-semibold">Chats</h2>
          <CreateChatDialog>
            <button
              className="w-fit min-w-16 rounded-xl bg-transparent p-1 transition-colors flex-center hover:bg-background [&_svg]:size-10"
              title="New Chat"
            >
              <SquarePen />
            </button>
          </CreateChatDialog>
        </header>
        {chats.length
          ? chats.map((chat) => (
              <ChatPreview
                key={chat.id}
                contactName={chat.contact.username}
                contactAvatar={chat.contact.avatarUrl}
                lastMessage={chat.messages.at(-1)}
                chatId={chat.id}
              />
            ))
          : null}
      </section>
    </InsetScrollArea>
  );
}

const ChatPreview: FC<{
  contactName: string;
  contactAvatar: string;
  lastMessage: Message | undefined;
  chatId: number;
}> = ({ contactName, contactAvatar, lastMessage, chatId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const unreadMessages = useUnreadMessages(chatId);

  const handleDelete = useMutation({
    mutationKey: ["chatDelete", chatId],
    mutationFn: async () => {
      const res = await api.chats[":chatId"].$delete({
        param: { chatId },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Could not delete this chat.");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["chat", chatId], exact: true });
      queryClient.setQueryData(["chats"], (old: Chat[]) =>
        old.filter((chat) => chat.id !== chatId)
      );
      queryClient.setQueryData(["unreadMessages"], (old: number[]) =>
        old.filter((id) => id !== chatId)
      );
      toast({ title: "Chat deleted successfully.", duration: 3000 });
    },
  });

  return (
    <AlertDialog>
      <ContextMenu modal={false}>
        <ContextMenuTrigger asChild>
          <Link
            to={"/chats/$chatId"}
            params={{ chatId }}
            className="flex h-20 w-full items-center justify-between gap-4 rounded-xl border bg-muted p-4 transition-colors hover:bg-muted-foreground/30 hover:text-foreground md:h-24"
          >
            <div className="relative h-full">
              {unreadMessages && (
                <span className="absolute right-0 z-10 size-3 rounded-full bg-red-500" />
              )}
              <Avatar className="min-h-full w-auto border-2 border-primary">
                <AvatarImage src={contactAvatar} alt={`${contactName} profile picture`} />
              </Avatar>
            </div>
            <div className="flex w-1/2 flex-1 flex-col items-end gap-3">
              {contactName !== "[deleted]" ? (
                <div className="font-semibold md:text-lg">{contactName}</div>
              ) : (
                <div className="font-thin italic text-muted-foreground md:text-lg">
                  Deleted User
                </div>
              )}
              <div className="line-clamp-1 text-end text-sm font-semibold text-muted-foreground">
                {lastMessage?.text}
              </div>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <AlertDialogTrigger asChild>
            <ContextMenuItem>Delete Chat</ContextMenuItem>
          </AlertDialogTrigger>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this chat?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete.mutate()}
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
