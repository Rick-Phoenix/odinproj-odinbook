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
import { Heart, MessageCircleMore, Share, ThumbsUp } from "lucide-react";
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
            <Carousel
              opts={{ loop: true, align: "start" }}
              className="max-w-full"
            >
              <CarouselContent>
                <CarouselPlaceholder />
                <CarouselPlaceholder />
                <CarouselPlaceholder />
                <CarouselPlaceholder />
                <CarouselPlaceholder />
                <CarouselPlaceholder />
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

function CarouselPlaceholder() {
  return (
    <CarouselItem className="flex aspect-video md:basis-1/2 2xl:basis-1/3">
      <Link to={"/post"} className="w-full rounded-xl bg-muted/50 p-4">
        <div className="flex h-full flex-1 flex-col justify-between">
          <div className="flex items-center justify-end gap-2 self-end">
            <div className="max-w-[10ch] truncate">42</div>
            <Heart className="min-w-fit" />
          </div>
          <div>
            <CardTitle className="flex items-center justify-between">
              <span className="line-clamp-[6] max-w-full">
                Enim aliquip laborum Lorem officia esse labore sint ad non velit
                minim. Minim dolor pariatur sit veniam do deserunt proident
                culpa labore mollit labore mollit enim. Do anim dolore dolore
                ipsum ipsum cupidatat proident.Minim mollit adipisicing enim
                excepteur incididunt qui officia incididunt ex excepteur
                consectetur mollit ad. Dolor non dolor laborum laborum eu nulla
                reprehenderit laboris mollit sit excepteur et. Magna fugiat elit
                minim duis sit proident nostrud Lorem commodo ad aliquip tempor.
                Eiusmod duis ex laboris pariatur elit non aliqua nisi irure
                proident tempor et labore eiusmod. Sit esse laborum do ullamco
                adipisicing nisi aute proident irure proident. Commodo dolore id
                minim fugiat commodo fugiat ex. Nostrud culpa pariatur velit
                tempor irure dolor sunt ad irure exercitation enim. Anim cillum
                officia id incididunt Lorem aliquip ipsum nulla laboris mollit
                anim. Non sunt eu adipisicing enim ut ea dolor occaecat ullamco
                sint esse qui sunt ex. Dolor non consequat pariatur consectetur
                dolor minim non. Proident ipsum consectetur aliqua exercitation
                ullamco esse. Excepteur velit enim nisi mollit consectetur duis
                Lorem fugiat veniam. Aliqua aliquip laboris duis amet
                exercitation velit velit aliqua ut deserunt. Et amet aliquip
                elit esse officia. Eiusmod irure commodo laboris do occaecat
                consequat eiusmod fugiat dolor esse non amet.
              </span>
            </CardTitle>
            <CardDescription className="line-clamp-1">
              r/Something
            </CardDescription>
          </div>
        </div>
      </Link>
    </CarouselItem>
  );
}
