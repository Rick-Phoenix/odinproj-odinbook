import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState, type FC } from "react";
import type { Comment } from "../../lib/api-client";
import { renderComments } from "../../pages/Post";
import { Separator } from "../ui/separator";
import ReplyButton from "./reply-button";

const PostComment: FC<{
  c: Comment;
  gridClassName: string;
  isNested: boolean;
  initialChildren?: Comment[];
  isLast: boolean;
}> = ({ c, gridClassName, isNested, initialChildren, isLast }) => {
  const [children, setChildren] = useState(initialChildren || []);
  let separatorRowEnd = children.length ? children.length + 3 : 3;
  if (isLast) separatorRowEnd--;
  const separatorRowEndClass = `row-end-${separatorRowEnd}`;
  const separatorHeight =
    isLast && !children.length ? "min-h-0" : "min-h-[calc(100%+4.5rem)]";
  const separatorClass = `col-start-1 row-start-2 ${separatorRowEndClass} ${separatorHeight} justify-self-center`;
  return (
    <div className={gridClassName}>
      <div
        className={`relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground`}
      >
        {isNested && (
          <span className="absolute -left-[1.27rem] top-[calc(-50%+1rem)] h-6 w-5 rounded-xl rounded-r-none rounded-t-none border-b border-l bg-transparent" />
        )}
        <Link to="/users/$username" params={{ username: c.author.username }}>
          <img src={c.author.avatarUrl} className="rounded-full" />
        </Link>
      </div>
      <div className="col-start-2 row-start-1 flex flex-col pl-4">
        <div className="flex gap-4">
          <Link to="/users/$username" params={{ username: c.author.username }}>
            {c.author.username}
          </Link>
        </div>
        <div>{format(new Date(c.createdAt), "dd MMM y | HH:MM")}</div>
      </div>

      <Separator orientation="vertical" className={separatorClass} />

      <div className="col-start-2 row-start-2 flex flex-col gap-2 pt-4">
        <div className="pl-4">{c.text}</div>
        <ReplyButton
          parentCommentId={c.id}
          postId={c.postId}
          setChildren={setChildren}
        />
      </div>

      {children && renderComments(children, 3, 2)}
    </div>
  );
};

export default PostComment;
