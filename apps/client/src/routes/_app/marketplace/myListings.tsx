import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ListingPreview from "../../../components/content-sections/ListingPreview";
import DeleteListingButton from "../../../components/custom-ui-blocks/buttons/DeleteListingButton";
import MarkAsSoldButton from "../../../components/custom-ui-blocks/buttons/MarkAsSoldButton";
import InsetScrollArea from "../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import type { Listing } from "../../../lib/db-types";

export const Route = createFileRoute("/_app/marketplace/myListings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: userListings } = useQuery<Listing[]>({
    queryKey: ["listingsCreated"],
    initialData: [],
  });

  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 auto-rows-fr grid-cols-1 grid-rows-[auto] rounded-xl bg-muted/50">
        {userListings.length ? (
          userListings.map((lis) => (
            <ListingPreview key={lis.id} listing={lis}>
              <div className="flex flex-col">
                <DeleteListingButton listing={lis} />
                <MarkAsSoldButton listing={lis} />
              </div>
            </ListingPreview>
          ))
        ) : (
          <div className="p-4 text-center italic">No listings have been created yet.</div>
        )}
      </section>
    </InsetScrollArea>
  );
}
