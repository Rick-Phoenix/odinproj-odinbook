import { Link } from "@tanstack/react-router";
import { MessageCircleMore, Share } from "lucide-react";
import { type FC, type MouseEventHandler } from "react";
import ButtonGesture from "../../animations/gestures";
import { Button } from "../../ui/button";

export function ShareButton() {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6">
      <ButtonGesture>
        <Share />
        Share
      </ButtonGesture>
    </Button>
  );
}

export const CommentButton: FC<{
  roomName: string;
  postId: number;
  onClick?: MouseEventHandler;
}> = ({ roomName, postId, onClick }) => {
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6" onClick={onClick}>
      <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
        <ButtonGesture className="flex gap-2">
          <MessageCircleMore />
          Comment
        </ButtonGesture>
      </Link>
    </Button>
  );
};
