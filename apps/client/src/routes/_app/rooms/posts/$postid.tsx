import { createFileRoute } from "@tanstack/react-router";
import Post from "../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/posts/$postid")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Post />;
}
