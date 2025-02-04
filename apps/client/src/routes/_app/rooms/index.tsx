// @ts-expect-error
import "swiper/css";
// @ts-expect-error
import "swiper/css/effect-coverflow";
// @ts-expect-error
import "swiper/css/pagination";
// @ts-expect-error
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FC } from "react";
import "swiper/css/scrollbar";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";

import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Autoplay, Mousewheel, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { PostPreview } from "../../../components/custom/post-preview";
import { Button } from "../../../components/ui/button";
import { CardTitle } from "../../../components/ui/card";
import type { PostFeed } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/rooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const feed = queryClient.getQueryData(["feed"]) as PostFeed[];
  console.log("🚀 ~ RouteComponent ~ feed:", feed);
  const trending = feed.slice(0, 6);
  return (
    <InsetScrollArea>
      <TrendingCarousel posts={trending} />
      {feed.map((post) => (
        <PostPreview
          key={post.id}
          title={post.title}
          text={post.text}
          room={"something"}
        />
      ))}
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
    <Link
      to={"/rooms/$roomName/posts/$postId"}
      params={{ roomName, postId }}
      className="flex aspect-video w-full rounded-xl bg-muted/50 p-4"
    >
      <div className="flex h-full flex-1 flex-col justify-between">
        <div className="flex items-center justify-end gap-2 self-end">
          <div className="max-w-[10ch] truncate">{likesCount}</div>
          <Heart className="min-w-fit" />
        </div>
        <div>
          <CardTitle className="line-clamp-[6] max-w-full scroll-m-20">
            {title}
          </CardTitle>
          <p className="mt-1 line-clamp-1 text-muted-foreground">
            r/{roomName}
          </p>
        </div>
      </div>
    </Link>
  );
};

const TrendingCarousel: FC<{ posts: PostFeed[] }> = ({ posts }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="p-3">
          <Button variant={"ghost"}>
            <small className="text-sm font-medium leading-none">
              🔥 Trending
            </small>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? "Hide" : "Show"}
          </DropdownMenuItem>
          <DropdownMenuItem>All Trending</DropdownMenuItem>
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
              centeredSlides={true}
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
                    roomName={post.roomName}
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
