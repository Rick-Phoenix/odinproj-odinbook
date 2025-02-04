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
  likesCount: number;
}> = ({ title, roomName, text, postId, likesCount }) => {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl bg-muted/50">
      <CardHeader className="pb-3">
        <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
          <CardTitle className="line-clamp-4 text-2xl">{title}</CardTitle>
        </Link>
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
        <LikeButton postId={postId} likesCount={likesCount} />
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

export const LikeButton: FC<{ postId: number; likesCount: number }> = ({
  postId,
  likesCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);

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
    onSuccess: () => {
      setIsLiked((old) => !old);
      setLikes((l) => (!isLiked ? l + 1 : l - 1));
    },
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
        {likes}
      </ButtonGesture>
    </Button>
  );
};
