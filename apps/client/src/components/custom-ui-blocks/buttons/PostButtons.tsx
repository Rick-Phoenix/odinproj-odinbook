import { Link } from "@tanstack/react-router";
import { MessageCircleMore, Share } from "lucide-react";
import { type FC, type MouseEventHandler } from "react";
import { useIsMobile } from "../../../hooks/useMobile";
import ButtonGesture from "../../animations/ButtonGesture";
import { Button } from "../../ui/button";

export function ShareButton() {
  const isMobile = useIsMobile();
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6 hover:text-primary">
      <ButtonGesture>
        <Share />
        {isMobile ? "" : "Share"}
      </ButtonGesture>
    </Button>
  );
}

export const CommentButton: FC<{
  roomName: string;
  postId: number;
  onClick?: MouseEventHandler;
}> = ({ roomName, postId, onClick }) => {
  const isMobile = useIsMobile();
  return (
    <Button variant={"ghost"} asChild className="flex-1 p-6 hover:text-primary" onClick={onClick}>
      <Link to="/rooms/$roomName/posts/$postId" params={{ roomName, postId }}>
        <ButtonGesture className="flex gap-2">
          <MessageCircleMore />
          {isMobile ? "" : "Comment"}
        </ButtonGesture>
      </Link>
    </Button>
  );
};
