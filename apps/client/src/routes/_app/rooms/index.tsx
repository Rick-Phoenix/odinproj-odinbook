import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FC } from "react";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import { PostPreview } from "../../../components/custom/post-preview";
import { Button } from "../../../components/ui/button";
import { CardTitle } from "../../../components/ui/card";
import { api, type InitialFeed, type PostBasic, type SortingOrder } from "../../../lib/api-client";
import { cachePost, getNextPostsByLikes, getNextPostsByTime, getPostsCursor } from "../../../lib/queries/caches";
import { sortPosts } from "../../../lib/queries/queryOptions";
import { throttleAsync, type ThrottledFunction } from "../../../utils/async-throttle";
import { getTotalPosts } from "../../../utils/extract-array";

export const Route = createFileRoute("/_app/rooms/")({
  component: RouteComponent,
  validateSearch: (s) => ({
    orderBy: (s.orderBy as SortingOrder) || "likesCount",
  }),
  loaderDeps: ({ search }) => search,
  loader: async (c) => {
    const { posts: initialPosts, total: totalPosts } = c.context.queryClient.getQueryData([
      "initialFeed",
      c.deps.orderBy,
    ]) as InitialFeed;
    return { initialPosts, totalPosts };
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const { orderBy } = Route.useSearch();
  const { totalPosts, initialPosts } = Route.useLoaderData();
  const initialCursor = getPostsCursor(initialPosts);
  console.log("🚀 ~ RouteComponent ~ initialPosts:", initialPosts);

  const spinnerRef = useRef<HTMLDivElement>(null);

  const feedQuery = useInfiniteQuery({
    queryKey: ["paginatedFeed", orderBy],
    queryFn: async (c) => {
      const {
        pageParam: { likes: cursorLikes, time: cursorTime },
      } = c;

      let prefetchedPosts = [] as PostBasic[];

      if (orderBy === "createdAt") {
        prefetchedPosts = getNextPostsByTime({ cursorTime, fromFeed: true });
      } else {
        prefetchedPosts = getNextPostsByLikes({ cursorLikes, cursorTime, fromFeed: true });
      }

      if (prefetchedPosts.length >= 10)
        return {
          posts: prefetchedPosts,
          cursor: getPostsCursor(prefetchedPosts),
        };

      const res = await api.posts.feed.data.$get({
        query: {
          orderBy,
          cursorLikes: cursorLikes!,
          cursorTime: cursorTime!,
        },
      });

      let posts = await res.json();
      if ("issues" in posts) {
        throw new Error("Error while fetching the posts for the main feed.");
      }

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

      return {
        posts,
        cursor,
      };
    },
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage, pages) => {
      if (getTotalPosts(pages) >= totalPosts || pages.length >= Math.ceil(totalPosts / 20)) return null;
      return lastPage.cursor;
    },
    initialData: {
      pageParams: [initialCursor],
      pages: [{ posts: initialPosts, cursor: initialCursor }],
    },
    enabled: totalPosts > initialPosts.length,
  });

  const posts = feedQuery.data.pages.reduce((acc, next) => {
    return acc.concat(next.posts);
  }, [] as PostBasic[]);

  const allTrendingPosts = queryClient.getQueryData(["initialFeed", "likesCount"]) as InitialFeed;
  const mostTrendingPosts = allTrendingPosts.posts.slice(0, 12);

  const throttledScrollFetch = useRef<ThrottledFunction>(null);
  useEffect(() => {
    throttledScrollFetch.current = throttleAsync(feedQuery.fetchNextPage, 3000, true);
    return () => (throttledScrollFetch.current ? throttledScrollFetch.current.cancel() : void null);
  }, [orderBy]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight * 0.9 &&
      feedQuery.hasNextPage &&
      spinnerRef.current &&
      throttledScrollFetch.current
    ) {
      spinnerRef.current.style.display = "flex";
      if (!feedQuery.isFetching) {
        await throttledScrollFetch.current();
        spinnerRef.current.style.display = "none";
      }
    }
  };

  return (
    <InsetScrollArea onScroll={handleScroll}>
      <TrendingCarousel posts={mostTrendingPosts} />
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
        <PostPreview key={post.id} post={post} />
      ))}

      <div role="status" className="hidden justify-center" ref={spinnerRef}>
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

      <div className="text-center text-sm italic text-muted-foreground">
        {!feedQuery.hasNextPage && "Hungry for more? Subscribe to more rooms to get more posts in your feed."}
      </div>
    </InsetScrollArea>
  );
}

const TrendingCard: FC<{
  likesCount: number;
  title: string;
  roomName: string;
  postId: number;
}> = ({ likesCount, title, roomName, postId }) => {
  return (
    <div className="group flex aspect-video w-full rounded-xl bg-muted/50 p-4 hover:bg-muted">
      <div className="flex h-full flex-1 flex-col justify-end">
        <Link
          to={"/rooms/$roomName/posts/$postId"}
          params={{ roomName, postId }}
          className="flex flex-1 flex-col justify-between"
        >
          <div className="flex items-center justify-end gap-2 self-end">
            <div className="max-w-[10ch] truncate">{likesCount}</div>
            <Heart className="min-w-fit group-hover:fill-white" />
          </div>
          <CardTitle className="line-clamp-2 max-w-full scroll-m-20 lg:line-clamp-5">{title}</CardTitle>
        </Link>
        <Link
          to="/rooms/$roomName"
          params={{ roomName }}
          search={{ orderBy: "likesCount" }}
          className="mt-1 line-clamp-1 text-muted-foreground"
        >
          r/{roomName}
        </Link>
      </div>
    </div>
  );
};

const TrendingCarousel: FC<{ posts: PostBasic[] }> = ({ posts }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="p-3">
          <Button variant={"ghost"}>
            <small className="text-sm font-medium leading-none">🔥 Trending Posts</small>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? "Hide" : "Show"} Trending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnimatePresence initial={false}>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="[--swiper-scrollbar-bottom:0] [--swiper-scrollbar-drag-bg-color:hsl(var(--muted-foreground)/0.3)]"
          >
            <Swiper
              modules={[Autoplay, Mousewheel, Scrollbar]}
              mousewheel={{
                invert: false,
              }}
              loop={true}
              scrollbar={{ hide: true }}
              breakpoints={{
                320: {
                  spaceBetween: 10,
                  slidesPerView: 1,
                },
                500: {
                  spaceBetween: 15,
                  slidesPerView: 2,
                },
                1270: {
                  spaceBetween: 15,
                  slidesPerView: 3,
                },
                1536: {
                  spaceBetween: 30,
                  slidesPerView: 3,
                },
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              grabCursor={true}
              coverflowEffect={{
                rotate: 50,
                slideShadows: false,
              }}
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <TrendingCard likesCount={post.likesCount} postId={post.id} title={post.title} roomName={post.room} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
