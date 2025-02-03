import { createFileRoute } from "@tanstack/react-router";
import { InsetScrollArea } from "../../../../../components/custom/sidebar-wrapper";
import Post from "../../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/$room/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, room }) => {
      return { postId: +postId, room };
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
