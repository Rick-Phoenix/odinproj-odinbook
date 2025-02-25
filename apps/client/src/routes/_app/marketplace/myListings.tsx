import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import DeleteListingButton from "../../../components/dialogs/custom/DeleteListingButton";
import InsetScrollArea from "../../../components/dialogs/custom/inset-scrollarea";
import ListingPreview from "../../../components/dialogs/custom/ListingPreview";
import MarkAsSoldButton from "../../../components/dialogs/custom/MarkAsSoldButton";
import type { Listing } from "../../../lib/api-client";

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
