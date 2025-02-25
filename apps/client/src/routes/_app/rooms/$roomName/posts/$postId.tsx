import { createFileRoute, notFound } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import InsetScrollArea from "../../../../../components/dialogs/custom/inset-scrollarea";
import { postQueryOptions } from "../../../../../lib/queries/queryOptions";
import Post from "../../../../../pages/Post";

const searchInputs = z.object({
  orderBy: fallback(z.enum(["likesCount", "createdAt"]), "likesCount").default("createdAt"),
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
    try {
      const post = await c.context.queryClient.fetchQuery(postQueryOptions(c.params.postId, c.params.roomName));
      return post;
    } catch (error) {
      throw notFound();
    }
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
