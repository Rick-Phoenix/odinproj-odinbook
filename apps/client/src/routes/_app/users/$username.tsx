import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC } from "react";
import InsetScrollArea from "../../../components/dialogs/custom/inset-scrollarea";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { type Listing } from "../../../lib/api-client";
import { profileQueryOptions } from "../../../lib/queries/queryOptions";

export const Route = createFileRoute("/_app/users/$username")({
  component: RouteComponent,
  loader: async (ctx) => {
    try {
      const { username } = ctx.params;
      return await ctx.context.queryClient.fetchQuery(profileQueryOptions(username));
    } catch (error) {
      throw notFound();
    }
  },
});

function RouteComponent() {
  const { username, avatarUrl, comments, listingsCreated, posts } = Route.useLoaderData();

  const postingHistory = [...comments, ...posts].sort((a, b) => {
    const d1 = new Date(a.createdAt);
    const d2 = new Date(b.createdAt);
    return d1 > d2 ? -1 : d1 === d2 ? 0 : 1;
  });

  return (
    <InsetScrollArea>
      <section className="grid min-h-[80vh] max-w-full grid-rows-[auto_1fr] items-center gap-4 rounded-xl border bg-muted/50">
        <header className="flex h-56 w-full items-center justify-center gap-8 rounded-xl bg-muted p-8 hover:text-foreground">
          <Avatar className="h-full w-auto border">
            <AvatarImage src={avatarUrl} alt={`${avatarUrl} profile picture`} />
          </Avatar>
          <h3 className="w-fit text-2xl font-semibold">{username}</h3>
        </header>
        <Tabs defaultValue="rooms" className="size-full min-h-64 max-w-full rounded-b-xl bg-muted/50 p-6">
          <TabsList className="flex w-full [&_button]:flex-grow">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="marketplace" className="">
              Marketplace
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rooms">
            {postingHistory.map((item, i) => {
              return "title" in item ? (
                <PostPreview key={i} room={item.room.name} title={item.title} text={item.text} postId={item.id} />
              ) : (
                <CommentPreview
                  key={i}
                  room={item.post.room.name}
                  text={item.text}
                  postTitle={item.post.title}
                  postId={item.post.id}
                  isDeleted={item.isDeleted}
                />
              );
            })}
          </TabsContent>
          <TabsContent value="marketplace">
            {listingsCreated.map((lis) => (
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
      className="group size-full max-w-full p-4"
    >
      <div
        className={`flex h-48 min-w-0 max-w-full items-center gap-4 rounded-lg border bg-muted p-4 ${listing.sold ? "line-through" : ""}`}
      >
        <div className="size-36 min-w-36 justify-self-center p-4">
          <img src={listing.picUrl} className="aspect-square object-contain" />
        </div>
        <div className="flex h-full max-w-full flex-col justify-center gap-3 *:break-words">
          <div className="flex min-w-0 max-w-full flex-col">
            <span className="line-clamp-2 break-words text-2xl font-semibold group-hover:underline">
              {listing.title}
            </span>
            <span className="text-accent-foreground">{listing.condition}</span>
            <span className="line-clamp-1 min-w-0 max-w-full text-ellipsis break-words text-accent-foreground">
              {listing.location} | {format(new Date(listing.createdAt), "dd MMM y")}
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
    <div className="mt-4 flex h-fit w-full gap-8 rounded-xl border bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground">
      <div className="grid w-full grid-cols-1 grid-rows-[auto_1fr]">
        <Link to={"/rooms/$roomName"} params={{ roomName: room }} search={{ orderBy: "likesCount" }}>
          r/{room}
        </Link>
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ postId, roomName: room }}
          className="flex flex-col justify-between"
        >
          <div className="break-words text-xl font-semibold">{postTitle}</div>
          <div className="mt-2 break-words">{text}</div>
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
  isDeleted: boolean;
}> = ({ room, postTitle, text, postId, isDeleted }) => {
  return (
    <div className="mt-4 flex h-fit w-full gap-8 rounded-xl border bg-muted p-6 py-4 hover:bg-muted-foreground/30 hover:text-foreground">
      <div className="grid w-full auto-rows-min grid-cols-1">
        <div className="flex gap-2">
          <Link to={"/rooms/$roomName"} params={{ roomName: room }} search={{ orderBy: "likesCount" }}>
            r/{room}
          </Link>
          <div> | </div>
          <Link
            to={"/rooms/$roomName/posts/$postId"}
            params={{ postId, roomName: room }}
            className="text-l break-words font-semibold"
          >
            {postTitle}
          </Link>
        </div>
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ postId, roomName: room }}
          className={isDeleted ? "mt-2 italic text-muted-foreground" : "mt-2 break-words"}
        >
          {text}
        </Link>
      </div>
    </div>
  );
};
