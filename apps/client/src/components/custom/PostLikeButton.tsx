import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import { api, type LikeData } from "../../lib/api-client";
import ButtonGesture from "../motion/gestures";
import { Button } from "../ui/button";

const PostLikeButton: FC<{
  postId: number;
}> = ({ postId }) => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData(["postLikes", postId]) as LikeData;
  const initialIsLiked = query?.isLiked;
  const initialLikeCount = query?.likesCount;
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);

  const likeMutation = useMutation({
    mutationKey: ["postLike", postId],
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
      queryClient.setQueryData(["postLikes", postId], (old: LikeData) => ({
        likesCount: isLiked ? old.likesCount - 1 : old.likesCount + 1,
        isLiked: !isLiked,
      }));
      setIsLiked((old) => !old);
      setLikeCount((old) => (isLiked ? old - 1 : old + 1));
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
      className="w-full flex-1 justify-center p-6"
    >
      <ButtonGesture>
        {isLiked ? <PiThumbsUpFill /> : <PiThumbsUpBold />}
        {likeCount}
      </ButtonGesture>
    </Button>
  );
};

export default PostLikeButton;
