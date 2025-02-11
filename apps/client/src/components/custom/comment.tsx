import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useState, type FC, type MouseEventHandler } from "react";
import type { Comment } from "../../lib/api-client";
import { renderComments } from "../../pages/Post";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ReplyButton from "./reply-button";

const PostComment: FC<{
  c: Comment;
  gridClassName: string;
  initialChildren?: Comment[];
  isLast: boolean;
}> = ({ c, gridClassName, initialChildren, isLast }) => {
  const [children, setChildren] = useState(initialChildren || []);
  const [isFolded, setIsFolded] = useState(false);
  const isNested = c.parentCommentId !== null;

  let separatorRowEnd = children.length ? children.length + 3 : 3;
  if (isLast || !isNested) separatorRowEnd--;
  const separatorRowEndClass = `row-end-${separatorRowEnd}`;
  const separatorHeight =
    isLast && !children.length ? "h-0" : "h-[calc(100%+4.5rem)]";
  const separatorClass = `w-full cursor-pointer flex justify-center col-start-1 row-start-2 ${separatorRowEndClass} ${separatorHeight} ${c.id} justify-self-center group/sep `;

  const connectorClass = `absolute connector -left-[1.27rem] top-[calc(-50%+1rem)] h-6 w-5 rounded-xl rounded-r-none rounded-t-none border-b 
  border-l bg-transparent`;

  const highlightConnectors: MouseEventHandler = (e) => {
    children.forEach((ch) => {
      const nodes = document.querySelectorAll(`#connector-${c.id}`);
      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.classList.add("active");
        }
      });
    });
  };

  const removeHighlightConnectors: MouseEventHandler = (e) => {
    children.forEach((ch) => {
      const nodes = document.querySelectorAll(`#connector-${c.id}`);
      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.classList.remove("active");
        }
      });
    });
  };

  if (isFolded)
    return (
      <div className={gridClassName}>
        <div
          className={`relative col-start-1 row-start-1 h-10 w-10 rounded-full`}
        >
          {isNested && (
            <span
              className={connectorClass}
              id={`connector-${c.parentCommentId}`}
            />
          )}
          <Button
            onClick={() => setIsFolded(false)}
            size={"icon"}
            variant={"outline"}
            className="rounded-full"
          >
            <PlusCircle />
          </Button>
        </div>
        <div className="col-start-2 row-start-1 flex flex-col pl-4">
          <div className="flex gap-4">
            <Link
              to="/users/$username"
              params={{ username: c.author.username }}
            >
              {c.author.username}
            </Link>
          </div>
          <div>{format(new Date(c.createdAt), "dd MMM y | HH:MM")}</div>
        </div>
      </div>
    );

  return (
    <div className={gridClassName}>
      <div
        className={`relative col-start-1 row-start-1 h-10 w-10 rounded-full bg-foreground`}
      >
        {isNested && (
          <span
            className={connectorClass}
            id={`connector-${c.parentCommentId}`}
          />
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

      <div
        className={separatorClass}
        onMouseEnter={highlightConnectors}
        onMouseLeave={removeHighlightConnectors}
        onClick={() => setIsFolded(true)}
      >
        <Separator
          orientation="vertical"
          className="group-hover/sep:bg-white"
        />
      </div>

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
