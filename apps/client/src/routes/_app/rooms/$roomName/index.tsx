import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useRef, useState, type FC } from "react";
import { z } from "zod";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
import { PostPreview } from "../../../../components/custom/post-preview";
import ButtonGesture from "../../../../components/motion/gestures";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useUser } from "../../../../hooks/auth";
import { api, type PostBasic } from "../../../../lib/api-client";
import { roomQueryOptions } from "../../../../lib/queryOptions";
import { throttleAsync, type ThrottledFunction } from "../../../../utils/async-throttle";

const searchInputs = z.object({
  orderBy: fallback(z.enum(["likesCount", "createdAt"]), "likesCount").default("likesCount"),
});

export const Route = createFileRoute("/_app/rooms/$roomName/")({
  component: RouteComponent,
  validateSearch: zodValidator(searchInputs),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, params, deps: { orderBy } }) => {
    const { roomName } = params;
    const room = await queryClient.fetchQuery(roomQueryOptions(roomName, orderBy));
    return room;
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { id: userId } = useUser()!;
  const navigate = useNavigate({ from: Route.fullPath });
  const {
    name: roomName,
    avatar,
    isSubscribed,
    posts: initialPosts,
    creatorId,
    totalPosts,
  } = Route.useLoaderData();
  const userIsCreator = userId === creatorId;
  const { orderBy } = Route.useSearch();
  const initialCursor = {
    time: initialPosts.at(-1)?.createdAt,
    likes: initialPosts.at(-1)?.likesCount,
  };

  const postsQuery = useInfiniteQuery({
    queryKey: ["posts", roomName, orderBy],
    queryFn: async (c) => {
      const { pageParam } = c;

      const res = await api.rooms[":roomName"].posts.$get({
        param: { roomName },
        query: {
          orderBy,
          cursorLikes: pageParam.likes!,
          cursorTime: pageParam.time!,
        },
      });
      const posts = await res.json();
      if ("issues" in posts) {
        throw new Error("Error while fetching the posts for this room.");
      }

      if (posts.length === 0) return { posts: [], cursor: null };

      for (const post of posts) queryClient.setQueryData(["post", post.id], post);

      const cursor = {
        time: posts.at(-1)?.createdAt,
        likes: posts.at(-1)?.likesCount,
      };

      return { posts, cursor };
    },
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length >= Math.ceil(totalPosts / 20)) return null;
      return lastPage.cursor;
    },
    initialData: {
      pageParams: [initialCursor],
      pages: [{ posts: initialPosts, cursor: initialCursor }],
    },
    enabled: totalPosts > 0,
  });

  const posts = postsQuery.data.pages.reduce((acc, next) => {
    return acc.concat(next.posts);
  }, [] as PostBasic[]);

  const throttledScrollFetch = useRef<ThrottledFunction>(null);
  useEffect(() => {
    throttledScrollFetch.current = throttleAsync(postsQuery.fetchNextPage, 3000, true);
    return () => (throttledScrollFetch.current ? throttledScrollFetch.current.cancel() : void null);
  }, [orderBy]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight * 0.9 &&
      !postsQuery.isFetching &&
      postsQuery.hasNextPage &&
      throttledScrollFetch.current
    ) {
      await throttledScrollFetch.current();
    }
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
            search={{ orderBy: "likesCount" }}
            className="text-center text-2xl font-semibold hover:underline"
          >
            r/{roomName}
          </Link>
          {userIsCreator ? (
            <RoomFounderMenu roomName={roomName} />
          ) : (
            <SubscribeButton roomName={roomName} isSubscribed={isSubscribed} />
          )}
        </header>
        <div className="flex h-12 items-center justify-center gap-3 rounded-xl bg-primary/80 p-1">
          <Button
            className="h-full flex-1 hover:bg-popover"
            variant={"secondary"}
            size={"lg"}
            onClick={() => navigate({ to: ".", search: { orderBy: "createdAt" } })}
            style={{
              ...(orderBy === "createdAt" && {
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
            onClick={() => navigate({ to: ".", search: { orderBy: "likesCount" } })}
            style={{
              ...(orderBy === "likesCount" && {
                backgroundColor: "hsl(var(--popover))",
              }),
            }}
          >
            Most Popular
          </Button>
        </div>
        {posts.map((post) => (
          <PostPreview post={post} key={post.id} />
        ))}
      </section>
    </InsetScrollArea>
  );
}

const RoomFounderMenu: FC<{
  roomName: string;
}> = ({ roomName }) => {
  const handleDelete = useMutation({
    mutationKey: ["roomDeletion", roomName],
    mutationFn: async () => {
      const res = await api.rooms[":roomName"].$delete({
        param: { roomName },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("An error occurred while trying to delete this room.");
      }
      return data;
    },
    onSuccess: () => {
      location.href = "/";
    },
  });

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"lg"} variant={"outline"}>
              Founder
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              <DropdownMenuItem className="w-full">Delete Room</DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Are you sure you want to delete this room?
            </DialogTitle>
            <DialogDescription>
              All the content belonging to this room will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3">
            <DialogClose asChild>
              <Button variant={"secondary"} size={"lg"}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"destructive"} onClick={() => handleDelete.mutate()} size={"lg"}>
                Delete
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SubscribeButton: FC<{
  isSubscribed: boolean;
  roomName: string;
}> = ({ isSubscribed, roomName }) => {
  const [userIsSubscribed, setUserIsSubscribed] = useState(isSubscribed);
  const queryClient = useQueryClient();
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
      queryClient.setQueryData(["roomSubs"], (old: string[]) =>
        isSubscribed ? old.filter((room) => room !== roomName) : [...old, roomName]
      );
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
                <DropdownMenuItem className="w-full">Unsubcribe</DropdownMenuItem>
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
