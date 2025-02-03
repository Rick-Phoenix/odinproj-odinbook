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
import { api } from "../../../lib/api-client";
import { lorem1par } from "../../../utils/lorem";

export const Route = createFileRoute("/_app/users/$username")({
  component: RouteComponent,
  loader: async (ctx) => {
    const { username } = ctx.params;
    return await ctx.context.queryClient.ensureQueryData({
      queryKey: ["profile", username],
      queryFn: async () => {
        const res = await api.users[":username"].$get({ param: { username } });
        const data = await res.json();
        if ("issues" in data) {
          throw new Error("Could not fetch user.");
        }
        return data;
      },
    });
  },
});

function RouteComponent() {
  const {
    username,
    avatarUrl,
    comments,
    createdAt,
    listingsCreated,
    posts,
    status,
  } = Route.useLoaderData();

  const postingHistory = [...comments, ...posts].sort((a, b) => {
    const d1 = new Date(a.createdAt);
    const d2 = new Date(b.createdAt);
    return d1 > d2 ? -1 : d1 === d2 ? 0 : 1;
  });

  console.log(postingHistory);
  return (
    <InsetScrollArea>
      <section className="grid min-h-[80vh] max-w-full grid-rows-[auto_1fr] items-center gap-4 rounded-xl bg-muted/50">
        <header className="flex h-56 w-full items-center justify-center gap-8 rounded-xl bg-muted p-8 hover:text-foreground">
          <Avatar className="h-full w-auto">
            <AvatarImage src={avatarUrl} alt={`${avatarUrl} profile picture`} />
          </Avatar>
          <h3 className="w-fit text-2xl font-semibold">{username}</h3>
        </header>
        <Tabs
          defaultValue="rooms"
          className="size-full min-h-64 rounded-b-xl bg-muted/50 p-6"
        >
          <TabsList className="flex w-full [&_button]:flex-grow">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="marketplace" className="">
              Marketplace
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rooms">
            {/* {postingHistory.map((item)=> {
              'title' in item ? <CommentHistoryItem
            })} */}
            <CommentHistoryItem room="cats" />
            <CommentHistoryItem room="cats" />
            <CommentHistoryItem room="cats" />
          </TabsContent>
          <TabsContent value="marketplace">
            <MarketplaceHistoryItem />
            <MarketplaceHistoryItem />
            <MarketplaceHistoryItem />
          </TabsContent>
        </Tabs>
      </section>
    </InsetScrollArea>
  );
}

const MarketplaceHistoryItem = () => {
  return (
    <div className="mt-4 grid grid-cols-[auto_1fr] grid-rows-1 rounded-lg bg-muted">
      <div className="justify-self-center p-4">
        <div className="size-40 rounded-lg bg-white"></div>
      </div>
      <div className="grid h-full grid-cols-1 grid-rows-[auto_auto_1fr] items-start gap-3 p-8 pt-4">
        <span className="text-2xl font-semibold group-hover:underline">
          Title
        </span>
        <span className="text-accent-foreground">Sold/Not sold</span>
        <span className="pt-6 text-3xl font-semibold">${100}</span>
      </div>
    </div>
  );
};

const CommentHistoryItem: FC<{
  room: string;
  postTitle: string;
  comment: string;
}> = ({ room, postTitle, comment }) => {
  return (
    <div className="mt-4 flex min-h-40 w-full gap-8 rounded-xl bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground">
      <div className="grid w-full grid-cols-1 grid-rows-[auto_1fr_1fr] gap-2">
        <div>r/{title(room)}</div>
        <div className="text-xl font-semibold">{lorem1par}</div>
        <div>{lorem1par}</div>
      </div>
    </div>
  );
};
