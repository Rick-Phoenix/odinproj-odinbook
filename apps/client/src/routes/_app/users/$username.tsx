import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC } from "react";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { api, type Listing } from "../../../lib/api-client";

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
  const { username, avatarUrl, comments, listingsCreated, posts } =
    Route.useLoaderData();

  const postingHistory = [...comments, ...posts].sort((a, b) => {
    const d1 = new Date(a.createdAt);
    const d2 = new Date(b.createdAt);
    return d1 > d2 ? -1 : d1 === d2 ? 0 : 1;
  });

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
            {postingHistory.map((item, i) => {
              return "title" in item ? (
                <PostPreview
                  key={i}
                  room={item.room.name}
                  title={item.title}
                  text={item.text}
                  postId={item.id}
                />
              ) : (
                <CommentPreview
                  key={i}
                  room={item.post.room.name}
                  text={item.text}
                  postTitle={item.post.title}
                  postId={item.post.id}
                />
              );
            })}
          </TabsContent>
          <TabsContent value="marketplace">
            {listingsCreated.map((lis) => (
              // <ListingPreview key={lis.id} listing={lis} />
              <MarketplaceHistoryItem key={lis.id} listing={lis} />
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </InsetScrollArea>
  );
}

const MarketplaceHistoryItem: FC<{ listing: Listing }> = ({ listing }) => {
  return (
    <Link
      to="/marketplace/$category/$itemId"
      params={{ category: listing.category, itemId: listing.id }}
      className="group size-full p-4"
    >
      <div
        className={`flex h-48 items-center gap-4 rounded-lg bg-muted p-4 ${listing.sold ? "line-through" : ""}`}
      >
        <div className="size-36 justify-self-center p-4">
          <img src={listing.picUrl} className="aspect-square object-contain" />
        </div>
        <div className="flex h-full flex-col justify-center gap-3">
          <div className="flex flex-col">
            <span className="break-normal text-2xl font-semibold group-hover:underline">
              {listing.title}
            </span>
            <span className="text-accent-foreground">{listing.condition}</span>
            <span className="text-accent-foreground">
              {listing.location} |{" "}
              {format(new Date(listing.createdAt), "dd MMM y")}
            </span>
          </div>
          <span className="text-xl font-semibold">${listing.price}</span>
        </div>
      </div>
    </Link>
  );
};

const PostPreview: FC<{
  room: string;
  title: string;
  text: string;
  postId: number;
}> = ({ room, title: postTitle, text, postId }) => {
  return (
    <div className="mt-4 flex h-fit w-full gap-8 rounded-xl bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground">
      <div className="grid w-full grid-cols-1 grid-rows-[auto_1fr]">
        <Link
          to={"/rooms/$roomName"}
          params={{ roomName: room }}
          search={{ orderBy: "likesCount" }}
        >
          r/{room}
        </Link>
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ postId, roomName: room }}
          className="flex flex-col justify-between"
        >
          <div className="text-xl font-semibold">{postTitle}</div>
          <div className="mt-2">{text}</div>
        </Link>
      </div>
    </div>
  );
};

const CommentPreview: FC<{
  room: string;
  postTitle: string;
  text: string;
  postId: number;
}> = ({ room, postTitle, text, postId }) => {
  return (
    <Link
      to={"/rooms/$roomName/posts/$postId"}
      params={{ postId, roomName: room }}
      className="mt-4 flex h-fit w-full gap-8 rounded-xl bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground"
    >
      <div className="grid w-full auto-rows-min grid-cols-1">
        <div className="flex gap-2">
          <Link
            to={"/rooms/$roomName"}
            params={{ roomName: room }}
            search={{ orderBy: "likesCount" }}
          >
            r/{room}
          </Link>
          <div> | </div>
          <div className="text-l font-semibold">{postTitle}</div>
        </div>
        <div className="mt-2">{text}</div>
      </div>
    </Link>
  );
};
