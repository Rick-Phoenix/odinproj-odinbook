import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SquarePen } from "lucide-react";
import type { FC } from "react";
import ChatDialog from "../../../components/custom/chat-dialog";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { chatsQueryOptions } from "../../../main";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.fetchQuery(chatsQueryOptions);
  },
});

function RouteComponent() {
  const { data: chats } = useSuspenseQuery(chatsQueryOptions);
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 gap-4 rounded-xl bg-muted/50 p-4">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted-foreground/30 p-8 hover:text-foreground">
          <h2 className="text-3xl font-semibold">Chats</h2>
          <ChatDialog>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="p-6 [&_svg]:size-10"
              title="New Chat"
            >
              <SquarePen />
            </Button>
          </ChatDialog>
        </header>
        {chats.length > 0 &&
          chats.map((chat) => (
            <ChatPreview
              key={chat.id}
              contactName={chat.contact.username}
              contactAvatar={chat.contact.avatarUrl}
              lastMessage={chat.messages.at(-1)?.text}
              chatId={chat.id}
            />
          ))}
      </section>
    </InsetScrollArea>
  );
}

const ChatPreview: FC<{
  contactName: string;
  contactAvatar: string;
  lastMessage: string | undefined;
  chatId: number;
}> = ({ contactName, contactAvatar, lastMessage, chatId }) => {
  return (
    <Link
      to={"/chats/$chatId"}
      params={{ chatId }}
      className="flex h-28 w-full items-center justify-between gap-8 rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
    >
      <Avatar className="h-full w-auto">
        <AvatarImage
          src={contactAvatar}
          alt={`${contactName} profile picture`}
        />
      </Avatar>
      <div className="flex w-1/2 flex-col items-end gap-3">
        <div className="text-lg font-semibold">{contactName}</div>
        <div className="line-clamp-1 text-end font-semibold text-muted-foreground">
          {lastMessage}
        </div>
      </div>
    </Link>
  );
};
