import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircleMore, Share, ThumbsUp } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";

export const Route = createFileRoute("/_auth/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ScrollArea
      type="always"
      className="h-full w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)]"
    >
      <main className="flex flex-1 flex-col gap-4 p-16 pb-6 pt-2">
        <TrendingCarousel />
        <div className="flex min-h-[100vh] flex-1 flex-col justify-between rounded-xl bg-muted/50 md:min-h-min">
          <CardHeader className="p-10">
            <CardTitle className="text-2xl">Post title</CardTitle>
            <CardDescription>r/Something</CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </CardContent>
          <div className="flex p-3">
            <Button variant={"ghost"} className="flex-1 p-6">
              <ThumbsUp />
              Like
            </Button>
            <Button variant={"ghost"} className="flex-1 p-6">
              <MessageCircleMore />
              Comment
            </Button>
            <Button variant={"ghost"} className="flex-1 p-6">
              <Share />
              Share
            </Button>
          </div>
        </div>
        <div className="flex min-h-[100vh] flex-1 flex-col justify-between rounded-xl bg-muted/50 md:min-h-min">
          <CardHeader className="p-10">
            <CardTitle className="text-2xl">Post title</CardTitle>
            <CardDescription>r/Something</CardDescription>
          </CardHeader>
          <CardContent className="pb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </CardContent>
          <div className="flex p-3">
            <Button variant={"ghost"} className="flex-1 p-6">
              <ThumbsUp />
              Like
            </Button>
            <Button variant={"ghost"} className="flex-1 p-6">
              <MessageCircleMore />
              Comment
            </Button>
            <Button variant={"ghost"} className="flex-1 p-6">
              <Share />
              Share
            </Button>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}

function TrendingCarousel() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-3">
          <small className="text-sm font-medium leading-none">
            🔥 Trending
          </small>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? "Hide" : "Show"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnimatePresence initial={false}>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <Link
                    to={"/post"}
                    className="flex aspect-video flex-col justify-end rounded-xl bg-muted/50"
                  >
                    <CardHeader>
                      <CardTitle className="p-0">Post 1</CardTitle>
                      <CardDescription className="card-trending p-0">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </CarouselItem>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video rounded-xl bg-muted/50"></div>
                </CarouselItem>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video rounded-xl bg-muted/50"></div>
                </CarouselItem>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video rounded-xl bg-muted/50"></div>
                </CarouselItem>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video rounded-xl bg-muted/50"></div>
                </CarouselItem>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
