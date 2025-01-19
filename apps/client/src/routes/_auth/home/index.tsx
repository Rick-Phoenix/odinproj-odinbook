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
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";

// Zustand store

export const Route = createFileRoute("/_auth/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <ScrollArea
      type="always"
      className="h-full w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-200px)]"
    >
      <main className="flex flex-1 flex-col gap-4 p-16 pb-6 pt-2">
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
        <TrendingCarousel isVisible={isVisible} />
        <div className="flex min-h-[100vh] flex-1 flex-col justify-end rounded-xl bg-muted/50 md:min-h-min md:min-h-screen">
          <CardContent>Blah</CardContent>
          <CardHeader>
            <CardTitle>Post 1</CardTitle>
            <CardDescription>Post description</CardDescription>
          </CardHeader>
        </div>
      </main>
    </ScrollArea>
  );
}

function TrendingCarousel({ isVisible }: { isVisible: boolean }) {
  return (
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
                  <CardContent>Blah</CardContent>
                  <CardHeader>
                    <CardTitle>Post 1</CardTitle>
                    <CardDescription>Post description</CardDescription>
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
  );
}
