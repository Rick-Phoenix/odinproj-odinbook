import { createFileRoute, notFound } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import Post from "../../../../../components/content-sections/Post";
import InsetScrollArea from "../../../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import { postQueryOptions } from "../../../../../lib/queries/queryOptions";

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
      const post = await c.context.queryClient.fetchQuery(
        postQueryOptions(c.params.postId, c.params.roomName)
      );
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
