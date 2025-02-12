import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageCircleMore, Share } from "lucide-react";
import { type FC, type MouseEventHandler } from "react";
import { PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import { api, type PostBasic } from "../../lib/api-client";
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

export const CommentButton: FC<{
  roomName: string;
  postId: number;
  onClick?: MouseEventHandler;
}> = ({ roomName, postId, onClick }) => {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6" onClick={onClick}>
      <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
        <ButtonGesture className="flex gap-2">
          <MessageCircleMore />
          Comment
        </ButtonGesture>
      </Link>
    </Button>
  );
};

export const LikeButton: FC<{
  postId: number;
}> = ({ postId }) => {
  const queryClient = useQueryClient();
  const {
    // @ts-expect-error (TS will see these as potentially undefined but they can't be because the page wouldn't load without the post's data)
    data: { isLiked, likesCount },
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const postData = queryClient.getQueryData(["post", postId]) as PostBasic;
      if (!postData)
        throw new Error("Error while fetching the likes for this post.");
      const { isLiked, likesCount } = postData;
      return { likesCount, isLiked };
    },
  });

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
      queryClient.setQueryData(["post", postId], (old: PostBasic) => ({
        ...old,
        isLiked: !old.isLiked,
        likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
      }));
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
        {likesCount}
      </ButtonGesture>
    </Button>
  );
};
