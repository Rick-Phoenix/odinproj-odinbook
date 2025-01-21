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
import { Heart, MessageCircleMore, Share } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";

import { Link } from "@tanstack/react-router";
import ButtonGesture from "../components/motion/gestures";
import { Button } from "../components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function MetaNexusMain() {
  return (
    <>
      <TrendingCarousel />
      <PostPreview />
      <PostPreview />
      <PostPreview />
    </>
  );
}

function PostPreview() {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-4 text-2xl">Post Title</CardTitle>
        <CardDescription>
          <p className="my-1 line-clamp-1">r/Something</p>
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="line-clamp-6">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s, when an unknown printer took a galley of type
        and scrambled it to make a type specimen book. It has survived not only
        five centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s, when an unknown printer took a galley of type
        and scrambled it to make a type specimen book. It has survived not only
        five centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </CardContent>
      <Separator className="mt-4 px-3" />
      <div className="flex p-3">
        <LikeButton />
        <CommentButton />
        <ShareButton />
      </div>
    </div>
  );
}

export function ShareButton() {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6">
      <ButtonGesture>
        <Share />
        Share
      </ButtonGesture>
    </Button>
  );
}

export function CommentButton() {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6">
      <ButtonGesture>
        <MessageCircleMore />
        Comment
      </ButtonGesture>
    </Button>
  );
}

export function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <Button
      asChild
      variant={"ghost"}
      onClick={() => {
        setIsLiked(!isLiked);
      }}
      className="w-full flex-1 justify-center p-6"
    >
      <ButtonGesture>
        {isLiked ? <PiThumbsUpFill /> : <PiThumbsUpBold />}
        Like
      </ButtonGesture>
    </Button>
  );
}

function TrendingCarousel() {
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
          >
            <Carousel
              opts={{ loop: true, align: "start" }}
              className="max-w-full"
            >
              <CarouselContent>
                <TrendingCard />
                <TrendingCard />
                <TrendingCard />
                <TrendingCard />
                <TrendingCard />
                <TrendingCard />
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

function TrendingCard() {
  return (
    <CarouselItem className="flex aspect-video md:basis-1/2 2xl:basis-1/3">
      <Link
        to={"/rooms/posts/$postid"}
        params={{ postid: "1" }}
        className="w-full rounded-xl bg-muted/50 p-4"
      >
        <div className="flex h-full flex-1 flex-col justify-between">
          <div className="flex items-center justify-end gap-2 self-end">
            <div className="max-w-[10ch] truncate">42</div>
            <Heart className="min-w-fit" />
          </div>
          <div>
            <CardTitle className="line-clamp-[6] max-w-full scroll-m-20">
              Enim aliquip laborum Lorem officia esse labore sint ad non velit
              minim. Minim dolor pariatur sit veniam do deserunt proident culpa
              labore mollit labore mollit enim. Do anim dolore dolore ipsum
              ipsum cupidatat proident.Minim mollit adipisicing enim excepteur
            </CardTitle>
            <p className="mt-1 line-clamp-1 text-muted-foreground">
              r/Something
            </p>
          </div>
        </div>
      </Link>
    </CarouselItem>
  );
}
