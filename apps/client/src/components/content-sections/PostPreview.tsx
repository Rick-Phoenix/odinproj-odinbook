import { type FC } from "react";

import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { PostBasic } from "../../lib/db-types";
import { CommentButton, ShareButton } from "../custom-ui-blocks/buttons/PostButtons";
import PostLikeButton from "../custom-ui-blocks/buttons/PostLikeButton";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export const PostPreview: FC<{
  post: PostBasic;
  inFeed?: boolean;
}> = ({ post: { title, room: roomName, text, id: postId, author, createdAt }, inFeed }) => {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl border bg-gray-800/20">
      <CardHeader className="flex flex-col gap-1 p-4 md:flex-row md:justify-between md:p-6">
        <div className="flex flex-col">
          <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
            <CardTitle className="line-clamp-4 text-lg md:text-2xl">{title}</CardTitle>
          </Link>
          {author === "[deleted]" ? (
            <span className="italic text-muted-foreground">
              Deleted User | {format(new Date(createdAt), "MMM do")}
            </span>
          ) : (
            <Link
              to="/users/$username"
              className="text-sm text-muted-foreground"
              params={{ username: author }}
            >
              @{author} | {format(new Date(createdAt), "MMM do")}
            </Link>
          )}
        </div>
        {inFeed && (
          <Link
            to="/rooms/$roomName"
            params={{ roomName }}
            className="!my-0 h-fit w-fit min-w-fit text-nowrap rounded-3xl border bg-primary/50 p-1 px-2 transition-colors hover:bg-primary md:p-2 md:px-4"
          >
            r/{roomName}
          </Link>
        )}
      </CardHeader>
      <Separator className="" />
      <CardContent className="line-clamp-6 p-4 text-sm md:p-6 md:text-base">{text}</CardContent>
      <Separator />
      <div className="flex md:p-2">
        <PostLikeButton postId={postId} />
        <CommentButton postId={postId} roomName={roomName} />
        <ShareButton />
      </div>
    </div>
  );
};
