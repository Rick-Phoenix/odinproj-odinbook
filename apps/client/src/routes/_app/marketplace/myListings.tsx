import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import ListingPreview from "../../../components/custom/ListingPreview";
import type { Listing } from "../../../lib/api-client";

export const Route = createFileRoute("/_app/marketplace/myListings")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const userListings = queryClient.getQueryData([
    "listingsCreated",
  ]) as Listing[];
  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 auto-rows-fr grid-cols-1 grid-rows-[auto] rounded-xl bg-muted/50">
        {userListings.length ? (
          userListings.map((lis) => (
            <ListingPreview key={lis.id} listing={lis} />
          ))
        ) : (
          <div className="p-4 text-center italic">
            No listings have been created yet.
          </div>
        )}
      </section>
    </InsetScrollArea>
  );
}
