import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useRef, useState, type FC } from "react";
import { TbBellPlus, TbBellRingingFilled, TbSpaces } from "react-icons/tb";
import { z } from "zod";
import { PostPreview } from "../../../../components/content-sections/PostPreview";
import InsetScrollArea from "../../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
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
import { useToast } from "../../../../hooks/useToast";
import type { PostBasic } from "../../../../lib/db-types";
import { api } from "../../../../lib/hono-RPC";
import {
  cachePost,
  getNextPostsByLikes,
  getNextPostsByTime,
  getPostsCursor,
} from "../../../../lib/queries/caches";
import { roomPostsQueryOptions, sortPosts } from "../../../../lib/queries/queryOptions";
import { throttleAsync, type ThrottledFunction } from "../../../../utils/async-throttle";
import { getTotalPosts } from "../../../../utils/get-total-posts";
import { parseLocalStorage } from "../../../../utils/localstorage-utils";

const sortingTypes = ["likesCount", "createdAt"] as const;
const sortingOrder = z.object({ orderBy: z.enum(sortingTypes) }).catch(() => {
  return {
    orderBy: parseLocalStorage(`preferred-posts-sorting`, sortingTypes) || "likesCount",
  };
});

export const Route = createFileRoute("/_app/rooms/$roomName/")({
  component: RouteComponent,
  validateSearch: zodValidator(sortingOrder),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, params, deps: { orderBy } }) => {
    try {
      const { roomName } = params;
      const { posts: initialPosts, ...room } = await queryClient.fetchQuery(
        roomPostsQueryOptions(roomName, orderBy)
      );
      return {
        room,
        initialPosts,
      };
    } catch (error) {
      throw notFound();
    }
  },
});

function RouteComponent() {
  const { id: userId } = useUser()!;
  const navigate = useNavigate({ from: Route.fullPath });
  const {
    room: { name: roomName, avatar, isSubscribed, creatorId, totalPosts },
    initialPosts,
  } = Route.useLoaderData();
  const userIsCreator = userId === creatorId;
  const { orderBy } = Route.useSearch();
  localStorage.setItem(`preferred-posts-sorting`, orderBy);

  const initialCursor = getPostsCursor(initialPosts);

  const postsQuery = useInfiniteQuery({
    // (Roomname is given, just with toLowerCase)
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["posts", roomName.toLowerCase(), orderBy],
    queryFn: async (c) => {
      const {
        pageParam: { likes: cursorLikes, time: cursorTime },
      } = c;

      let prefetchedPosts = [] as PostBasic[];

      if (orderBy === "createdAt") {
        prefetchedPosts = getNextPostsByTime({ cursorTime, room: roomName.toLowerCase() });
      } else {
        prefetchedPosts = getNextPostsByLikes({
          cursorLikes,
          cursorTime,
          room: roomName.toLowerCase(),
        });
      }

      if (prefetchedPosts.length >= 3)
        return {
          posts: prefetchedPosts,
          cursor: getPostsCursor(prefetchedPosts),
        };

      const res = await api.rooms[":roomName"].posts.$get({
        param: { roomName },
        query: {
          orderBy,
          cursorLikes: cursorLikes,
          cursorTime: cursorTime,
        },
      });

      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Error while fetching the posts for this room.");
      }

      let { posts } = data;

      if (!posts.length) return { posts: prefetchedPosts, cursor: null };

      for (const post of posts) cachePost(post);
      if (prefetchedPosts.length) {
        const newPageIds = new Set<number>(posts.map((p) => p.id));
        prefetchedPosts.forEach((p, i) => {
          if (newPageIds.has(p.id)) prefetchedPosts.slice(i, 1);
        });
      }

      posts = sortPosts(posts.concat(prefetchedPosts), orderBy);

      const cursor = getPostsCursor(posts);

      return { posts, cursor };
    },
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage, pages) => {
      if (getTotalPosts(pages) >= totalPosts || pages.length >= Math.ceil(totalPosts / 20))
        return null;
      return lastPage.cursor;
    },
    initialData: {
      pageParams: [initialCursor],
      pages: [{ posts: initialPosts, cursor: initialCursor }],
    },
    enabled: totalPosts > initialPosts.length,
  });

  const posts = postsQuery.data.pages.reduce((acc, next) => {
    return acc.concat(next.posts);
  }, [] as PostBasic[]);

  const throttledScrollFetch = useRef<ThrottledFunction>(null);
  useEffect(() => {
    throttledScrollFetch.current = throttleAsync(postsQuery.fetchNextPage, 3000, true);
    return () => (throttledScrollFetch.current ? throttledScrollFetch.current.cancel() : void null);
  }, [orderBy, postsQuery.fetchNextPage]);

  const spinnerRef = useRef<HTMLDivElement>(null);
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight * 0.9 &&
      postsQuery.hasNextPage &&
      spinnerRef.current &&
      throttledScrollFetch.current
    ) {
      spinnerRef.current.style.display = "flex";
      if (!postsQuery.isFetching) {
        throttledScrollFetch
          .current()
          .then()
          // eslint-disable-next-line no-console
          .catch((e) => console.error("Error while fetching new posts."));
        spinnerRef.current.style.display = "none";
      }
    }
  };
  return (
    <InsetScrollArea onScroll={posts.length >= 20 ? handleScroll : undefined}>
      <section className="flex h-full flex-col justify-between gap-8 rounded-xl bg-transparent">
        <header className="flex h-32 w-full items-center rounded-xl border-2 border-primary bg-slate-900 p-4">
          <Avatar className="h-full w-auto overflow-visible">
            <AvatarImage
              src={avatar}
              alt={`${roomName} avatar`}
              className="h-full w-auto rounded-full border-2 border-primary"
            />
          </Avatar>
          <div className="flex h-full flex-1 flex-col items-center justify-between [&_svg]:size-5">
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
          </div>
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

        <div role="status" ref={spinnerRef} className="hidden justify-center">
          <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>

        <div className="flex justify-center text-center text-sm italic text-muted-foreground [&_svg]:size-8">
          {!postsQuery.hasNextPage && <TbSpaces />}
        </div>
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
      // eslint-disable-next-line react-compiler/react-compiler
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
      const res = await api.rooms[":roomName"].subscriptions.$patch({
        param: { roomName },
        query: { action },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Could not subscribe to the room. Try again later.");
      }
      return action;
    },
    onSuccess: (action) => {
      queryClient.setQueryData(["roomSubs"], (old: string[]) =>
        isSubscribed
          ? old.filter((room) => room.toLowerCase() !== roomName.toLowerCase())
          : [...old, roomName]
      );
      setUserIsSubscribed((old) => !old);
      toast({
        title:
          action === "add"
            ? `You are now subscribed to ${roomName}.`
            : `You have unsubscribed from ${roomName}.`,
      });
    },
  });
  const { toast } = useToast();
  return (
    <>
      {userIsSubscribed ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"sm"}
                type="button"
                className="min-w-max rounded-xl bg-primary/70 p-2 flex-center"
              >
                Subscribed{" "}
                <span className="-translate-y-[2px]">
                  <TbBellRingingFilled />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full">Unsubscribe</DropdownMenuItem>
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
                <Button variant={"destructive"} onClick={() => subscribeMutation.mutate()}>
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Button
          size={"sm"}
          type="button"
          className="min-w-max rounded-xl p-2 flex-center"
          onClick={() => subscribeMutation.mutate()}
        >
          Subscribe
          <span className="-translate-y-[2px]">
            <TbBellPlus />
          </span>
        </Button>
      )}
    </>
  );
};
