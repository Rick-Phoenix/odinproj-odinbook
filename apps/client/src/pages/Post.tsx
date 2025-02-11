import { type FC } from "react";
import {
  CommentButton,
  LikeButton,
  ShareButton,
} from "../components/custom/buttons";
import PostComment from "../components/custom/comment";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import type { Comment, PostFull } from "../lib/api-client";

export function renderComments(
  comments: Comment[],
  startingRow: number,
  startingColumn: number,
) {
  return comments.map((c, i) => {
    const row = startingRow + i;
    const children = c?.children;
    const gridClassName = `col-start-${startingColumn} row-start-${row} grid grid-cols-[auto_1fr] items-center ${startingColumn !== 1 || row !== 1 ? "pt-8" : " "} ${startingColumn === 1 ? "col-end-3" : " "}`;
    let separatorRowEnd = children ? children.length + 3 : 3;
    if (startingColumn > 1) separatorRowEnd--;
    const separatorRowEndClass = `row-end-${separatorRowEnd}`;
    const separatorHeight =
      i === comments.length - 1 && !children
        ? "min-h-0"
        : "min-h-[calc(100%+4.5rem)]";
    const separatorClass = `col-start-1 row-start-2 ${separatorRowEndClass} ${separatorHeight} justify-self-center`;
    return (
      <PostComment
        key={c.id}
        c={c}
        gridClassName={gridClassName}
        isNested={startingColumn > 1}
        separatorClass={separatorClass}
        initialChildren={children}
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

const Post: FC<{ post: PostFull }> = ({ post }) => {
  const nestedComments = nestComments(post.comments);
  console.log(nestedComments);

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
        <Input placeholder="Write a comment..." />
      </div>
      <Separator className="mt-1" />

      <div className="p-6">
        <div className="py-6">Comments</div>
        <div className="grid grid-cols-[2.5rem_1fr] items-center">
          {renderComments(nestedComments, 1, 1)}
        </div>
      </div>
    </section>
  );
};

export default Post;
