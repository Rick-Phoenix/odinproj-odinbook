import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SquarePen } from "lucide-react";
import type { FC } from "react";
import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { api } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  const chats = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await api.chats.$get();
      if (!res.ok) throw Error("Server Error");
      const data = await res.json();
      return data;
    },
  });
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 gap-4 rounded-xl bg-muted/50 p-4">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted-foreground/30 p-8 hover:text-foreground">
          <h2 className="text-3xl font-semibold">Chats</h2>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="p-6 [&_svg]:size-10"
            title="New Chat"
          >
            <SquarePen />
          </Button>
        </header>
        {Array.isArray(chats.data) &&
          chats.data.map((chat, i) => (
            <ChatPreview
              key={i}
              contactName={chat.contact.username}
              contactAvatar={chat.contact.avatarUrl}
              lastMessage={chat.messages.at(-1)?.text}
            />
          ))}
      </section>
    </InsetScrollArea>
  );
}

const ChatPreview: FC<{
  contactName: string;
  contactAvatar: string;
  lastMessage: string;
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
        <div className="line-clamp-1 pr-3 text-end font-semibold text-muted-foreground">
          {lastMessage}
        </div>
      </div>
    </Link>
  );
};
