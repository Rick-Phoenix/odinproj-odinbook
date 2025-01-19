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
import { Button } from "../../../components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

// Zustand store

export const Route = createFileRoute("/_auth/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <main className="flex flex-1 flex-col gap-4 p-16 pb-6 pt-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
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
        </DropdownMenuContent>
      </DropdownMenu>
      <AnimatePresence initial={false}>
        {" "}
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Carousel>
              <CarouselContent>
                <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                  <Link
                    to={"/post"}
                    className="flex aspect-video flex-col justify-end rounded-xl bg-muted/50"
                  >
                    {/* <div className="aspect-video rounded-xl bg-muted/50">opst 1</div> */}

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
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex min-h-[100vh] flex-1 flex-col justify-end rounded-xl bg-muted/50 md:min-h-min">
        <CardContent>Blah</CardContent>
        <CardHeader>
          <CardTitle>Post 1</CardTitle>
          <CardDescription>Post description</CardDescription>
        </CardHeader>
      </div>
    </main>
  );
}
