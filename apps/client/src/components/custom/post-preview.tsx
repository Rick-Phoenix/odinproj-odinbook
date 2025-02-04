import { MessageCircleMore, Share } from "lucide-react";
import { useState, type FC } from "react";

import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import ButtonGesture from "../motion/gestures";

import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "../../lib/api-client";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export const PostPreview: FC<{
  title: string;
  roomName: string;
  text: string;
  postId: number;
}> = ({ title, roomName, text, postId }) => {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-4 text-2xl">{title}</CardTitle>
        <CardDescription>
          <Link
            to="/rooms/$roomName"
            params={{ roomName }}
            className="my-1 line-clamp-1"
          >
            r/{roomName}
          </Link>
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="line-clamp-6">{text}</CardContent>
      <Separator className="mt-4 px-3" />
      <div className="flex p-3">
        <LikeButton postId={postId} />
        <CommentButton />
        <ShareButton />
      </div>
    </div>
  );
};

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

export const LikeButton: FC<{ postId: number }> = ({ postId }) => {
  const [isLiked, setIsLiked] = useState(false);

  const likeMutation = useMutation({
    mutationKey: ["like", postId],
    mutationFn: async () => {
      const action = !isLiked ? "add" : "remove";
      const res = await api.posts[":postId"].like.$post({
        param: { postId },
        query: { action },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Could not register the like. Try again later.");
      }
      return data;
    },
    onSuccess: () => setIsLiked(!isLiked),
  });

  return (
    <Button
      asChild
      variant={"ghost"}
      disabled={likeMutation.isPending}
      onClick={() => {
        likeMutation.mutate();
      }}
      className="w-full flex-1 justify-center p-6"
    >
      <ButtonGesture>
        {isLiked ? <PiThumbsUpFill /> : <PiThumbsUpBold />}
        Like
      </ButtonGesture>
    </Button>
  );
};
