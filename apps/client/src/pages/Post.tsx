import { Link } from "@tanstack/react-router";
import { useRef, useState, type FC, type MouseEventHandler } from "react";
import { CommentButton, ShareButton } from "../components/custom/buttons";
import PostComment from "../components/custom/comment";
import CommentInput from "../components/custom/comment-input";
import PostLikeButton from "../components/custom/PostLikeButton";
import { Button } from "../components/ui/button";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import type { Comment, PostFull } from "../lib/api-client";

export function renderComments(comments: Comment[], startingRow: number, startingColumn: number) {
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

const Post: FC<{ post: PostFull; orderBy: "likesCount" | "createdAt" }> = ({ post, orderBy }) => {
  const [rootComments, setRootComments] = useState(nestComments(post.comments));
  const sortedComments = rootComments
    .slice()
    .sort((a, b) =>
      orderBy === "likesCount"
        ? b.likesCount - a.likesCount
        : new Date(a.createdAt) > new Date(b.createdAt)
          ? -1
          : 1
    );

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput: MouseEventHandler = (e) => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current.focus();
    }
  };

  return (
    <section className="min-h-svh overflow-x-auto rounded-xl bg-muted/50">
      <CardHeader>
        <CardTitle className="text-2xl">{post.title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">{post.text}</CardContent>
      <Separator className="mt-1" />
      <div className="flex p-3">
        <PostLikeButton postId={post.id} />
        <CommentButton roomName={post.room.name} postId={post.id} onClick={focusInput} />
        <ShareButton />
      </div>
      <Separator className="mt-1" />
      <div className="my-4 p-6">
        <CommentInput ref={inputRef} setRootComments={setRootComments} postId={post.id} />
      </div>
      <Separator className="mt-1" />

      <div className="p-6">
        <div className="flex items-center gap-5 py-6">
          <span className="border-b-2 font-semibold">Comments</span>
          <SortComments orderBy={orderBy} />
        </div>
        <div className="grid grid-cols-[2.5rem_1fr] items-center">
          {renderComments(sortedComments, 1, 1)}
        </div>
      </div>
    </section>
  );
};

const SortComments: FC<{ orderBy: "likesCount" | "createdAt" }> = ({ orderBy }) => {
  const selection = orderBy === "createdAt" ? "✨ Most Recent" : "🚀 Most Popular";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="rounded-2xl px-6">
          Sorted By: {selection}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col rounded-lg p-2 text-center *:flex *:w-full *:justify-center">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuItem className="px-4" asChild>
          <Link
            to="."
            from="/rooms/$roomName/posts/$postId"
            replace={true}
            search={{ orderBy: "createdAt" }}
          >
            ✨ Most Recent
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4" asChild>
          <Link
            to="."
            from="/rooms/$roomName/posts/$postId"
            replace={true}
            search={{ orderBy: "likesCount" }}
          >
            🚀 Most Popular
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Post;
