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
      <CardHeader className="flex flex-row justify-between gap-4 pb-0">
        <div className="flex flex-col">
          <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
            <CardTitle className="line-clamp-4 text-2xl">{title}</CardTitle>
          </Link>
          {author === "[deleted]" ? (
            <span className="italic text-muted-foreground">Deleted User</span>
          ) : (
            <Link to="/users/$username" params={{ username: author }}>
              @{author}
            </Link>
          )}
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
        <Link
          to="/rooms/$roomName"
          params={{ roomName }}
          className="h-fit text-nowrap rounded-xl bg-muted p-2 px-4 hover:bg-muted-foreground/50"
        >
          r/{roomName}
        </Link>
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
