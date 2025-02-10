import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import InsetScrollArea from "../../../../../components/custom/inset-scrollarea";
import { postQueryOptions } from "../../../../../lib/queryOptions";
import Post from "../../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/$roomName/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, roomName }) => {
      return { postId: +postId, roomName };
    },
  },
  validateSearch: zodValidator(z.object({ new: z.boolean().optional() })),
  loader: async (c) => {
    const post = c.context.queryClient.fetchQuery(
      postQueryOptions(c.params.postId),
    );

    return post;
  },
});

function RouteComponent() {
  const post = Route.useLoaderData();

  return (
    <InsetScrollArea>
      <Post post={post} />
    </InsetScrollArea>
  );
}
