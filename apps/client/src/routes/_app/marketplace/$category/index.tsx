import { schemas } from "@nexus/shared-schemas";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { format } from "date-fns";
import type { FC } from "react";
import { z } from "zod";
import InsetScrollArea from "../../../../components/custom/inset-scrollarea";
import { listingsByCategoryQueryOptions } from "../../../../lib/queryOptions";

const searchParams = z.object({
  orderBy: fallback(z.enum(["cheapest", "mostRecent"]), "mostRecent").default(
    "mostRecent",
  ),
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
      listingsByCategoryQueryOptions(c.params.category, c.deps.orderBy),
    );
    return listings;
  },
});

function RouteComponent() {
  const listings = Route.useLoaderData();
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 grid-cols-1 grid-rows-6 rounded-xl bg-muted/50">
        {listings.map((lis) => (
          <ItemListing
            key={lis.id}
            id={lis.id}
            price={lis.price}
            title={lis.title}
            category={lis.category}
            location={lis.location}
            createdAt={lis.createdAt}
            picUrl={lis.picUrl}
            condition={lis.condition}
          />
        ))}
      </section>
    </InsetScrollArea>
  );
}

const ItemListing: FC<{
  price: number;
  title: string;
  category: string;
  id: number;
  location: string;
  createdAt: string;
  picUrl: string;
  condition: string;
}> = ({
  price,
  title,
  category,
  id,
  location,
  createdAt,
  picUrl,
  condition,
}) => {
  return (
    <Link
      to="/marketplace/$category/$itemId"
      params={{ category, itemId: id }}
      className="group size-full p-4"
    >
      <div className="grid h-48 grid-cols-[auto_1fr] grid-rows-1 items-center rounded-lg bg-muted p-3">
        <div className="size-36 justify-self-center p-4">
          <img src={picUrl} className="aspect-square object-contain" />
        </div>
        <div className="flex h-full flex-col justify-between gap-3 p-8 pt-4">
          <div className="flex flex-col">
            <span className="break-normal text-2xl font-semibold group-hover:underline">
              {title}
            </span>
            <span className="text-accent-foreground">{condition}</span>
            <span className="text-accent-foreground">
              {location} | {format(new Date(createdAt), "dd MMM y")}
            </span>
          </div>
          <span className="text-xl font-semibold">${price}</span>
        </div>
      </div>
    </Link>
  );
};
