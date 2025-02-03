import { createFileRoute } from "@tanstack/react-router";
import InsetScrollArea from "../../../../../components/custom/sidebar-wrapper";
import Post from "../../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/$roomName/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, roomName }) => {
      return { postId: +postId, roomName };
    },
  },
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <Post />
    </InsetScrollArea>
  );
}
