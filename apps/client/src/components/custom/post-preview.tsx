import { type FC } from "react";

import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { PostBasic } from "../../lib/api-client";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { CommentButton, ShareButton } from "./buttons";
import PostLikeButton from "./PostLikeButton";

export const PostPreview: FC<{
  post: PostBasic;
}> = ({
  post: { title, room: roomName, text, id: postId, author, createdAt, isLiked, likesCount },
}) => {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl bg-gray-900">
      <CardHeader className="pb-0">
        <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
          <CardTitle className="line-clamp-4 text-2xl">{title}</CardTitle>
        </Link>
        <div className="flex flex-col">
          <Link to="/users/$username" params={{ username: author }}>
            @{author}
          </Link>
          <CardDescription>
            <Link
              to="/rooms/$roomName"
              params={{ roomName }}
              search={{ orderBy: "likesCount" }}
              className="my-1 line-clamp-1"
            >
              r/{roomName} | {format(new Date(createdAt), "MMM do")}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="line-clamp-6">{text}</CardContent>
      <Separator />
      <div className="flex p-3">
        <PostLikeButton postId={postId} />
        <CommentButton postId={postId} roomName={roomName} />
        <ShareButton />
      </div>
    </div>
  );
};
