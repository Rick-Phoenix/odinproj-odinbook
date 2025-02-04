import { type FC } from "react";

import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { CommentButton, LikeButton, ShareButton } from "./buttons";

export const PostPreview: FC<{
  title: string;
  roomName: string;
  text: string;
  postId: number;
  likesCount: number;
  author: string;
  createdAt: string;
}> = ({ title, roomName, text, postId, likesCount, author, createdAt }) => {
  return (
    <div className="flex max-h-[50%] min-h-min flex-col justify-between rounded-xl bg-muted/50">
      <CardHeader className="pb-3">
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
              className="my-1 line-clamp-1"
            >
              r/{roomName} | {format(new Date(createdAt), "MMM do")}
            </Link>
          </CardDescription>
        </div>
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
