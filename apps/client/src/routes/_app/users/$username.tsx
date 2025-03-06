import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC } from "react";
import InsetScrollArea from "../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import type { Listing } from "../../../lib/db-types";
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
        <header className="flex h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-primary bg-muted p-3 hover:text-foreground md:flex-row md:gap-8 md:p-8">
          <Avatar className="w-auto flex-1 border-2 border-primary md:h-full md:flex-none">
            <AvatarImage
              src={avatarUrl}
              className="object-cover"
              alt={`${avatarUrl} profile picture`}
            />
          </Avatar>
          <h3 className="w-max text-nowrap break-keep rounded-xl bg-blue-500 p-2 text-2xl font-semibold text-background">
            {username}
          </h3>
        </header>
        <Tabs
          defaultValue="rooms"
          className="size-full min-h-64 max-w-full rounded-b-xl bg-background p-2 md:p-6"
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
        className={`flex h-48 min-w-0 max-w-full items-center gap-4 rounded-lg border bg-muted p-4 hover:bg-muted/80 ${listing.sold ? "line-through" : ""}`}
      >
        <div className="size-28 min-w-28 justify-self-center p-4 md:size-36 md:min-w-36">
          <img src={listing.picUrl} className="aspect-square rounded-sm object-contain" />
        </div>
        <div className="flex h-full max-w-full flex-col justify-center gap-3 *:break-words">
          <div className="flex min-w-0 max-w-full flex-col">
            <span className="line-clamp-2 break-words font-semibold group-hover:underline md:text-2xl">
              {listing.title}
            </span>
            <span className="text-sm text-accent-foreground">{listing.condition}</span>
            <span className="line-clamp-1 min-w-0 max-w-full text-ellipsis break-words text-sm text-accent-foreground">
              {listing.location} | {format(new Date(listing.createdAt), "dd MMM y")}
            </span>
          </div>
          <span className="text-sm text-xl font-semibold">${listing.price}</span>
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
    <div className="mt-4 flex h-fit w-full gap-8 rounded-xl border bg-muted p-6 hover:bg-muted/80 hover:text-foreground">
      <div className="grid w-full grid-cols-1 grid-rows-[auto_1fr] gap-y-1 text-sm">
        <Link
          to={"/rooms/$roomName"}
          params={{ roomName: room }}
          search={{ orderBy: "likesCount" }}
          className="mb-1 flex w-fit flex-col rounded-2xl bg-muted-foreground/50 p-1 px-3 text-sm hover:bg-slate-500"
        >
          r/{room}
        </Link>
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ postId, roomName: room }}
          className="flex flex-col justify-between"
        >
          <div className="break-words text-xl font-semibold">{postTitle}</div>
          <div className="mt-2 break-words text-sm">{text}</div>
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
    <div className="mt-4 flex h-fit w-full gap-8 rounded-xl border bg-muted p-6 py-4 hover:bg-muted/80 hover:text-foreground">
      <div className="grid w-full auto-rows-min grid-cols-1">
        <div className="mb-1 flex flex-col gap-1">
          <Link
            to={"/rooms/$roomName"}
            params={{ roomName: room }}
            search={{ orderBy: "likesCount" }}
            className="mb-1 flex w-fit flex-col rounded-2xl bg-muted-foreground/50 p-1 px-3 text-sm hover:bg-slate-500"
          >
            r/{room}
          </Link>

          <Link
            to={"/rooms/$roomName/posts/$postId"}
            params={{ postId, roomName: room }}
            className="line-clamp-1 break-words font-semibold [word-break:break-word]"
          >
            {postTitle}
          </Link>
        </div>
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ postId, roomName: room }}
          className={
            isDeleted ? "text-sm italic text-muted-foreground" : "break-words text-sm font-normal"
          }
        >
          {text}
        </Link>
      </div>
    </div>
  );
};
