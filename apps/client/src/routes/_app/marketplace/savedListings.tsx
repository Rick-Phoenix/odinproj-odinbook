import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ListingPreview from "../../../components/content-sections/ListingPreview";
import SaveListingButton from "../../../components/custom-ui-blocks/buttons/SaveListingButton";
import InsetScrollArea from "../../../components/custom-ui-blocks/inset-area/InsetScrollarea";
import type { Listing } from "../../../lib/db-types";

export const Route = createFileRoute("/_app/marketplace/savedListings")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [savedListings, setSavedListings] = useState(
    queryClient.getQueryData(["listingsSaved"]) as Listing[]
  );

  return (
    <InsetScrollArea>
      <section className="grid min-h-[75vh] max-w-full flex-1 auto-rows-fr grid-cols-1 grid-rows-[auto] rounded-xl bg-muted/50">
        {savedListings.length ? (
          savedListings.map((lis) => (
            <ListingPreview key={lis.id} listing={lis}>
              <div
                onClick={() => setSavedListings(savedListings.filter((list) => list.id !== lis.id))}
              >
                <SaveListingButton listing={lis} inPreview={true} />
              </div>
            </ListingPreview>
          ))
        ) : (
          <div className="p-4 text-center italic">No listings have been saved yet.</div>
        )}
      </section>
    </InsetScrollArea>
  );
}

function Icon() {
  return <span className="p-4">Remove</span>;
}
