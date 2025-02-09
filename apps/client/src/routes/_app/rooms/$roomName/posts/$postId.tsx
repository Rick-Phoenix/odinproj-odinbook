import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import InsetScrollArea from "../../../../../components/custom/inset-scrollarea";
import type { PostBasic, PostFull } from "../../../../../lib/api-client";
import {
  postQueryOptions,
  roomQueryOptions,
} from "../../../../../lib/queryOptions";
import Post from "../../../../../pages/Post";

export const Route = createFileRoute("/_app/rooms/$roomName/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, roomName }) => {
      return { postId: +postId, roomName };
    },
  },
  validateSearch: zodValidator(z.object({ new: z.boolean().optional() })),
  beforeLoad: async (c) => {
    let post;
    if (c.search.new) {
      post = c.context.queryClient.getQueryData(["post", c.params.postId]) as
        | PostBasic
        | undefined;
    } else {
      post = c.context.queryClient.fetchQuery(
        postQueryOptions(c.params.postId),
      );
    }
    if (!post) throw new Error("Post not found.");
    const room = await c.context.queryClient.fetchQuery(
      roomQueryOptions(c.params.roomName),
    );
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { postId } = Route.useParams();
  const post = queryClient.getQueryData(["post", postId]) as
    | PostFull
    | PostBasic;
  console.log("🚀 ~ RouteComponent ~ post:", post);
  return (
    <InsetScrollArea>
      <Post post={post} />
    </InsetScrollArea>
  );
}
