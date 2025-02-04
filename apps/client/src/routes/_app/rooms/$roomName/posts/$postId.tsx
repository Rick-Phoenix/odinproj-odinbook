import { createFileRoute } from "@tanstack/react-router";
import InsetScrollArea from "../../../../../components/custom/inset-scrollarea";
import type { PostFull } from "../../../../../lib/api-client";
import Post from "../../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/$roomName/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, roomName }) => {
      return { postId: +postId, roomName };
    },
  },
  loader: async (c) => {
    const post = c.context.queryClient.getQueryData(["post", c.params.postId]);
    console.log(post);
    return post;
  },
});

function RouteComponent() {
  const post = Route.useLoaderData() as PostFull;
  return (
    <InsetScrollArea>
      <Post post={post} />
    </InsetScrollArea>
  );
}
