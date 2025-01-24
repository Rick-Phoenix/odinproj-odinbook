import { createFileRoute, Link } from "@tanstack/react-router";
import type { FC } from "react";
import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";

export const Route = createFileRoute("/_app/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 gap-4 rounded-xl bg-muted/50 p-4">
        <ChatPreview
          contactName="Nickname"
          contactAvatar="https://github.com/shadcn.png"
          lastMessage="Eu incididunt fugiat mollit nostrud aute cupidatat excepteur labore
          duis laborum aliqua ullamco. Lorem dolore est qui mollit culpa. Sunt
          eu mollit excepteur non veniam sint tempor irure dolore non tempor.
          Sit laborum duis reprehenderit dolore officia elit aliqua. Anim eu
          dolor labore officia do id veniam magna elit officia ex pariatur sunt."
        />
      </section>
    </InsetScrollArea>
  );
}

const ChatPreview: FC<{
  contactName: string;
  contactAvatar: string;
  lastMessage: string;
}> = ({ contactName, contactAvatar, lastMessage }) => {
  return (
    <Link
      to={"/chats/$contact"}
      params={{ contact: contactName }}
      className="flex h-28 w-full items-center justify-between gap-8 rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground"
    >
      <Avatar>
        <AvatarImage
          src={contactAvatar}
          alt={`${contactName} profile picture`}
        />
      </Avatar>
      <div className="flex max-w-[50%] flex-col items-end gap-3">
        <div className="text-lg font-semibold">{contactName}</div>
        <div className="line-clamp-1 font-semibold text-muted-foreground">
          {lastMessage}
        </div>
      </div>
    </Link>
  );
};
