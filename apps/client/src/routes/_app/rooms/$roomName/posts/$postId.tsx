import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import InsetScrollArea from "../../../../../components/custom/inset-scrollarea";
import { postQueryOptions } from "../../../../../lib/queryOptions";
import Post from "../../../../../pages/Post";

const searchInputs = z.object({
  orderBy: fallback(z.enum(["likesCount", "createdAt"]), "likesCount").default(
    "createdAt",
  ),
});

export const Route = createFileRoute("/_app/rooms/$roomName/posts/$postId")({
  component: RouteComponent,
  params: {
    parse: ({ postId, roomName }) => {
      return { postId: +postId, roomName };
    },
  },
  validateSearch: zodValidator(searchInputs),
  loader: async (c) => {
    const post = c.context.queryClient.fetchQuery(
      postQueryOptions(c.params.postId),
    );

    return post;
  },
});

function RouteComponent() {
  const post = Route.useLoaderData();
  const { orderBy } = Route.useSearch();

  return (
    <InsetScrollArea>
      <Post post={post} orderBy={orderBy} />
    </InsetScrollArea>
  );
}
