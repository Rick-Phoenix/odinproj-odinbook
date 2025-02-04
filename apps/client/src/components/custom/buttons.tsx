import { useMutation } from "@tanstack/react-query";
import { MessageCircleMore, Share } from "lucide-react";
import { type FC, useState } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import { api } from "../../lib/api-client";
import ButtonGesture from "../motion/gestures";
import { Button } from "../ui/button";

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
