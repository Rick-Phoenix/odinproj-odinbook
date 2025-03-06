import { Link } from "@tanstack/react-router";
import { useRef, useState, type FC, type MouseEventHandler } from "react";
import type { Comment, PostFull } from "../../lib/db-types";
import { CommentButton, ShareButton } from "../custom-ui-blocks/buttons/PostButtons";
import PostLikeButton from "../custom-ui-blocks/buttons/PostLikeButton";
import CommentInput from "../custom-ui-blocks/input/CommentInput";
import { Button } from "../ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import PostComment from "./Comment";

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
    <section className="min-h-svh w-full min-w-0 overflow-x-auto rounded-xl border bg-gray-800/20">
      <CardHeader className="flex max-w-full flex-row justify-between gap-4 break-all">
        <div className="flex w-full flex-col">
          <Link
            to="/rooms/$roomName"
            params={{ roomName: post.room.name }}
            className="mb-2 flex w-fit flex-col rounded-2xl bg-primary/50 p-1 px-3 transition-colors hover:bg-primary"
          >
            r/{post.room.name}
          </Link>
          <CardTitle className="min-w-0 max-w-full break-words text-2xl [word-break:break-word]">
            {post.title}
          </CardTitle>
          <CardDescription className="relative">
            {post.author === "[deleted]" ? (
              <span className="italic">Deleted User</span>
            ) : (
              <Link
                to="/users/$username"
                className="flex w-fit -translate-x-2 rounded-2xl p-1 px-2 transition-colors hover:bg-muted-foreground/50 hover:text-foreground"
                params={{ username: post.author }}
              >
                @{post.author}
              </Link>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 md:p-6">{post.text}</CardContent>
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

      <ScrollArea className="overflow-x-auto p-3 md:p-6">
        <div className="flex items-center gap-5 py-6">
          <span className="border-b-2 font-semibold">Comments</span>
          <SortComments orderBy={orderBy} />
        </div>

        <div className="relative grid w-full min-w-full grid-cols-[2.5rem_1fr] items-center">
          {renderComments(sortedComments, 1, 1)}
        </div>
        <ScrollBar orientation="horizontal" className="absolute bottom-0" />
      </ScrollArea>
    </section>
  );
};

const SortComments: FC<{ orderBy: "likesCount" | "createdAt" }> = ({ orderBy }) => {
  const selection = orderBy === "createdAt" ? "✨ Most Recent" : "🚀 Most Popular";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="rounded-2xl bg-accent px-6 hover:bg-background hover:text-accent-foreground"
        >
          Sort By: {selection}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col rounded-lg text-center *:flex *:w-full *:justify-center">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-0" />
        <DropdownMenuItem className="mb-2 px-4" asChild>
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
