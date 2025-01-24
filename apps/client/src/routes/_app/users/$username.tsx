import { createFileRoute } from "@tanstack/react-router";
import { title } from "radashi";
import type { FC } from "react";
import { InsetScrollArea } from "../../../components/custom/sidebar-wrapper";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { lorem1par } from "../../../utils/lorem";

export const Route = createFileRoute("/_app/users/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  return (
    <InsetScrollArea>
      <section className="grid min-h-[80vh] max-w-full grid-rows-[auto_1fr] items-center gap-4 rounded-xl bg-muted/50">
        <header className="flex h-56 w-full items-center justify-center gap-6 rounded-xl bg-muted p-8 hover:text-foreground">
          <Avatar className="h-full w-auto">
            <AvatarImage
              src={"https://github.com/shadcn.png"}
              alt={`${username} profile picture`}
            />
          </Avatar>
          <h3 className="w-fit text-2xl font-semibold">{username}</h3>
        </header>
        <Tabs
          defaultValue="account"
          className="size-full min-h-64 rounded-b-xl bg-muted/50 p-6"
        >
          <TabsList className="flex w-full [&_button]:flex-grow">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="password" className="">
              Marketplace
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rooms">
            <CommentHistoryItem room="cats" />
            <CommentHistoryItem room="cats" />
            <CommentHistoryItem room="cats" />
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </section>
    </InsetScrollArea>
  );
}

const CommentHistoryItem: FC<{
  room: string;
  postTitle: string;
  comment: string;
}> = ({ room, postTitle, comment }) => {
  return (
    <div className="mt-2 flex min-h-40 w-full gap-8 rounded-xl bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground">
      <div className="grid w-full grid-cols-1 grid-rows-[auto_1fr_1fr] gap-2">
        <div>r/{title(room)}</div>
        <div className="text-xl font-semibold">{lorem1par}</div>
        <div>{lorem1par}</div>
      </div>
    </div>
  );
};
