import { Link } from "@tanstack/react-router";
import { useState, type FC } from "react";
import {
  CommentButton,
  LikeButton,
  ShareButton,
} from "../components/custom/buttons";
import PostComment from "../components/custom/comment";
import CommentInput from "../components/custom/comment-input";
import { Button } from "../components/ui/button";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import type { Comment, PostFull } from "../lib/api-client";

export function renderComments(
  comments: Comment[],
  startingRow: number,
  startingColumn: number,
) {
  return comments.map((c, i, arr) => {
    const row = startingRow + i;
    const children = c?.children;
    const gridClassName = `col-start-${startingColumn} row-start-${row} grid grid-cols-[auto_1fr] items-center ${startingColumn !== 1 || row !== 1 ? "pt-8" : " "} ${startingColumn === 1 ? "col-end-3" : " "}`;
    const isLast = i === arr.length - 1;
    return (
      <PostComment
        key={c.id}
        c={c}
        gridClassName={gridClassName}
        initialChildren={children}
        isLast={isLast}
      />
    );
  });
}

function nestComments(comments: Comment[]) {
  const nestMap = new Map<number, Comment[]>();
  const rootComments = [] as Comment[];
  comments.forEach((c) => {
    if (c.parentCommentId) {
      const parId = c.parentCommentId;
      const relMapEntry = nestMap.get(parId);
      relMapEntry ? relMapEntry.push(c) : nestMap.set(parId, [c]);
    } else rootComments.push(c);
  });

  function recursive(c: Comment) {
    const children = nestMap.get(c.id);
    if (children) {
      c.children = children;
      children.forEach(recursive);
    }
    return c;
  }

  rootComments.forEach(recursive);
  return rootComments;
}

const Post: FC<{ post: PostFull; orderBy: "likesCount" | "createdAt" }> = ({
  post,
  orderBy,
}) => {
  const [rootComments, setRootComments] = useState(nestComments(post.comments));
  const sortedComments = rootComments
    .slice()
    .sort((a, b) =>
      orderBy === "likesCount"
        ? b.likesCount - a.likesCount
        : new Date(a.createdAt) > new Date(b.createdAt)
          ? -1
          : 1,
    );

  return (
    <section className="min-h-svh overflow-x-auto rounded-xl bg-muted/50">
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">{post.text}</CardContent>
      <Separator className="mt-1" />
      <div className="flex p-3">
        <LikeButton postId={post.id} />
        <CommentButton roomName={post.room.name} postId={post.id} />
        <ShareButton />
      </div>
      <Separator className="mt-1" />
      <div className="my-4 p-6">
        <CommentInput setRootComments={setRootComments} postId={post.id} />
      </div>
      <Separator className="mt-1" />

      <div className="p-6">
        <div className="flex items-center gap-3 py-6">
          <span>Comments</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"}>Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col text-center *:flex *:w-full *:justify-center">
              <DropdownMenuItem asChild>
                <Link to="." search={{ orderBy: "createdAt" }}>
                  ✨ New
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="." search={{ orderBy: "likesCount" }}>
                  🚀 Popular
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-[2.5rem_1fr] items-center">
          {renderComments(sortedComments, 1, 1)}
        </div>
      </div>
    </section>
  );
};

export default Post;
