import { schemas } from "@nexus/shared-schemas";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import InsetScrollArea from "../../../../components/dialogs/custom/inset-scrollarea";
import ListingPreview from "../../../../components/dialogs/custom/ListingPreview";
import { Button } from "../../../../components/ui/button";
import { listingsByCategoryQueryOptions } from "../../../../lib/queries/queryOptions";

const searchParams = z.object({
  orderBy: fallback(z.enum(["cheapest", "mostRecent"]), "mostRecent").default("mostRecent"),
});
const pathParams = z.object({
  category: z.enum(schemas.marketplaceCategories),
});

export const Route = createFileRoute("/_app/marketplace/$category/")({
  component: RouteComponent,
  validateSearch: zodValidator(searchParams),
  params: { parse: (p) => pathParams.parse(p) },
  loaderDeps: ({ search }) => search,
  loader: async (c) => {
    const listings = await c.context.queryClient.fetchQuery(
      listingsByCategoryQueryOptions(c.params.category, c.deps.orderBy)
    );
    return listings;
  },
});

function RouteComponent() {
  const listings = Route.useLoaderData();
  const { orderBy } = Route.useSearch();
  const navigate = useNavigate();
  const sortedListings = listings
    .slice()
    .sort((a, b) =>
      orderBy === "cheapest"
        ? a.price - b.price
        : new Date(a.createdAt) > new Date(b.createdAt)
          ? -1
          : 1
    );
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 auto-rows-fr grid-cols-1 grid-rows-[auto] rounded-xl border bg-gray-800/20">
        <div className="flex h-12 items-center justify-center gap-3 rounded-xl bg-primary/80 p-1">
          <Button
            className="h-full flex-1 hover:bg-popover"
            variant={"secondary"}
            size={"lg"}
            onClick={() => navigate({ to: ".", search: { orderBy: "cheapest" } })}
            style={{
              ...(orderBy === "cheapest" && {
                backgroundColor: "hsl(var(--popover))",
              }),
            }}
          >
            Cheapest
          </Button>
          <Button
            className="h-full flex-1"
            variant={"secondary"}
            size={"lg"}
            onClick={() => navigate({ to: ".", search: { orderBy: "mostRecent" } })}
            style={{
              ...(orderBy === "mostRecent" && {
                backgroundColor: "hsl(var(--popover))",
              }),
            }}
          >
            Most Recent
          </Button>
        </div>
        {sortedListings.map((lis) => (
          <ListingPreview key={lis.id} listing={lis} />
        ))}
      </section>
    </InsetScrollArea>
  );
}
