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
import { throttleAsync, type ThrottledFunction } from "../../../utils/async-throttle";

export const Route = createFileRoute("/_app/rooms/")({
  component: RouteComponent,
  validateSearch: (s) => ({
    orderBy: (s.orderBy as SortingOrder) || "likesCount",
  }),
  loaderDeps: ({ search }) => search,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const { orderBy } = Route.useSearch();
  const { posts: initialPosts, total: totalPosts } = queryClient.getQueryData([
    "initialFeed",
    orderBy,
  ]) as InitialFeed;
  const initialCursor = {
    time: initialPosts.at(-1)?.createdAt,
    likes: initialPosts.at(-1)?.likesCount,
  };

  const feedQuery = useInfiniteQuery({
    queryKey: ["feed", orderBy],
    queryFn: async (c) => {
      const { pageParam } = c;
      const res = await api.posts.feed.$get({
        query: {
          orderBy,
          cursorLikes: pageParam.likes!,
          cursorTime: pageParam.time!,
        },
      });
      const data = await res.json();
      if ("issues" in data) {
        throw new Error("Error while fetching the posts for the main feed.");
      }
      for (const post of data) {
        queryClient.setQueryData(["post", post.id], post);
      }

      if (data.length === 0) return { posts: [], cursor: null };
      const cursor = {
        time: data.at(-1)?.createdAt,
        likes: data.at(-1)?.likesCount,
      };

      return {
        posts: data,
        cursor,
      };
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
      !feedQuery.isFetching &&
      feedQuery.hasNextPage &&
      throttledScrollFetch.current
    ) {
      await throttledScrollFetch.current();
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
      <div className="text-center text-sm italic text-muted-foreground">
        Hungry for more? Subscribe to more rooms to get more posts in your feed.
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
          <CardTitle className="line-clamp-[6] max-w-full scroll-m-20">{title}</CardTitle>
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
                1024: {
                  spaceBetween: 15,
                  slidesPerView: 2,
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
                  <TrendingCard
                    likesCount={post.likesCount}
                    postId={post.id}
                    title={post.title}
                    roomName={post.room}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
