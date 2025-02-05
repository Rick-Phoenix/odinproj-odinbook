import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FC } from "react";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
import { PostPreview } from "../../../../components/custom/post-preview";
import ButtonGesture from "../../../../components/motion/gestures";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  api,
  type PostBasic,
  type SortingOrder,
} from "../../../../lib/api-client";
import { roomQueryOptions } from "../../../../lib/queryOptions";

export const Route = createFileRoute("/_app/rooms/$roomName/")({
  component: RouteComponent,
  validateSearch: (s) => ({ orderBy: (s.orderBy as SortingOrder) || "likes" }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, params, deps: { orderBy } }) => {
    const { roomName } = params;
    const room = await queryClient.fetchQuery(
      roomQueryOptions(roomName, orderBy),
    );
    const initialPosts: PostBasic[] = queryClient.getQueryData([
      "posts",
      roomName,
    ])!;
    return { room, initialPosts };
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const {
    room: { name: roomName, avatar, isSubscribed },
    initialPosts,
  } = Route.useLoaderData();
  const { orderBy } = Route.useSearch();
  const postsQuery = useInfiniteQuery({
    queryKey: ["posts", roomName, "infinite"],
    queryFn: async (c) => {
      const { pageParam } = c;
      console.log("🚀 ~ queryFn: ~ pageParam:", pageParam);
      const res = await api.rooms[":roomName"].posts.$get({
        param: { roomName: "PC Builders" },
        query: { orderBy: "likes", cursor: pageParam },
      });
      const posts = await res.json();
      if ("issues" in posts) {
        throw new Error("");
      }
      for (const post of posts) {
        queryClient.setQueryData(["post", post.id], post);
      }
      return { posts, nextCursor: pageParam + 1 };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts.length === 0) return null;
      return lastPage.nextCursor;
    },
    initialData: {
      pageParams: [1],
      pages: [{ posts: initialPosts, nextCursor: 2 }],
    },
  });
  console.log("🚀 ~ RouteComponent ~ postsQuery:", postsQuery.data);

  const posts = postsQuery.data.pages.reduce((acc, next) => {
    return acc.concat(next.posts);
  }, [] as PostBasic[]);

  const sortedPosts = posts.sort((a, b) =>
    orderBy === "likes"
      ? b.likesCount - a.likesCount
      : new Date(b.createdAt) > new Date(a.createdAt)
        ? -1
        : 1,
  );

  const handleScroll: React.UIEventHandler<HTMLDivElement> = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight * 0.9 &&
      !postsQuery.isFetching
    ) {
      await postsQuery.fetchNextPage();
    }
    console.log("🚀 ~ RouteComponent ~ scrollTop:", scrollTop);
    console.log("🚀 ~ RouteComponent ~ scrollHeight:", scrollHeight);
    console.log("🚀 ~ RouteComponent ~ clientHeight:", clientHeight);
  };
  return (
    <InsetScrollArea onScroll={posts.length >= 20 ? handleScroll : undefined}>
      <section className="flex h-full flex-col justify-between gap-8 rounded-xl bg-transparent">
        <header className="flex h-28 w-full items-center justify-between rounded-xl bg-muted p-8 hover:bg-muted-foreground/30 hover:text-foreground">
          <Avatar className="h-full w-auto">
            <AvatarImage src={avatar} alt={`${roomName} avatar`} />
          </Avatar>
          <Link
            to="/rooms/$roomName"
            params={{ roomName }}
            search={{ orderBy: "likes" }}
            className="text-center text-2xl font-semibold hover:underline"
          >
            r/{roomName}
          </Link>
          <SubscribeButton roomName={roomName} isSubscribed={isSubscribed} />
        </header>
        <div className="flex h-12 items-center justify-center gap-3 rounded-xl bg-primary/80 p-1">
          <Button
            className="h-full flex-1 hover:bg-popover"
            variant={"secondary"}
            size={"lg"}
            onClick={() => navigate({ to: ".", search: { orderBy: "time" } })}
            style={{
              ...(orderBy === "time" && {
                backgroundColor: "hsl(var(--popover))",
              }),
            }}
          >
            Newest
          </Button>
          <Button
            className="h-full flex-1"
            variant={"secondary"}
            size={"lg"}
            onClick={() => navigate({ to: ".", search: { orderBy: "likes" } })}
            style={{
              ...(orderBy === "likes" && {
                backgroundColor: "hsl(var(--popover))",
              }),
            }}
          >
            Most Popular
          </Button>
        </div>
        {sortedPosts.map((post) => (
          <PostPreview post={post} key={post.id} />
        ))}
      </section>
    </InsetScrollArea>
  );
}

const SubscribeButton: FC<{ isSubscribed: boolean; roomName: string }> = ({
  isSubscribed,
  roomName,
}) => {
  const [userIsSubscribed, setUserIsSubscribed] = useState(isSubscribed);

  const subscribeMutation = useMutation({
    mutationKey: ["subscription", roomName],
    mutationFn: async () => {
      const action = !userIsSubscribed ? "add" : "remove";
      const res = await api.rooms[":roomName"].subscribe.$post({
        param: { roomName },
        query: { action },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Could not subscribe to the room. Try again later.");
      }
      return data;
    },
    onSuccess: () => {
      setUserIsSubscribed((old) => !old);
    },
  });

  return (
    <>
      {userIsSubscribed ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"lg"} variant={"outline"}>
                Subscribed
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full">
                  Unsubcribe
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                Are you sure you want to unsubcribe?
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center gap-3">
              <DialogClose asChild>
                <Button variant={"secondary"} size={"lg"}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  onClick={() => subscribeMutation.mutate()}
                  size={"lg"}
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button asChild size={"lg"} onClick={() => subscribeMutation.mutate()}>
          <ButtonGesture>Subscribe</ButtonGesture>
        </Button>
      )}
    </>
  );
};
