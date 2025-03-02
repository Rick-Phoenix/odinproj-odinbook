import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import { api, type Comment } from "../../../lib/api-client";
import ButtonGesture from "../../animations/gestures";
import { Button } from "../../ui/button";

const CommentLikeButton: FC<{
  commentId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
}> = ({ commentId, initialIsLiked, initialLikeCount }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationKey: ["commentLike", commentId],
    mutationFn: async () => {
      const action = !isLiked ? "add" : "remove";
      const res = await api.posts.comments[":commentId"].likes.$patch({
        param: { commentId },
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
      setLikeCount((old) => (isLiked ? old - 1 : old + 1));
      queryClient.setQueryData(["comment", commentId], (old: Comment) => ({
        ...old,
        isLiked: !isLiked,
        likesCount: isLiked ? old.likesCount - 1 : old.likesCount + 1,
      }));
    },
  });

  return (
    <Button
      asChild
      variant={"ghost"}
      size={"icon"}
      disabled={likeMutation.isPending}
      onClick={() => {
        likeMutation.mutate();
      }}
      className="group min-w-fit rounded-3xl p-6 px-8 hover:text-primary"
    >
      <ButtonGesture>
        {isLiked ? (
          <PiThumbsUpFill className="fill-primary/70 transition-colors group-hover:fill-primary" />
        ) : (
          <PiThumbsUpBold />
        )}
        {likeCount}
      </ButtonGesture>
    </Button>
  );
};

export default CommentLikeButton;
