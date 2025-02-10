import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { api, type Listing } from "../../lib/api-client";
import { Button } from "../ui/button";

const SaveListingButton: FC<{ listing: Listing }> = ({ listing }) => {
  const [isSaved, setIsSaved] = useState(listing.isSaved);
  const queryClient = useQueryClient();
  const handleSaveListing = useMutation({
    mutationKey: ["savedListing", listing.id],
    mutationFn: async () => {
      const res = await api.market.listings[":itemId"].save.$post({
        param: { itemId: listing.id },
        query: { action: isSaved ? "remove" : "add" },
      });
      if (!res.ok) {
        throw new Error("Error while saving or removing this listing.");
      }
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["listingsSaved"], (old: Listing[]) => {
        return isSaved
          ? old.filter((lis) => lis.id !== listing.id)
          : [...old, { ...listing, isSaved: true }];
      });
      queryClient.setQueryData(["listing"], { ...listing, isSaved: !isSaved });
      setIsSaved((old) => !old);
    },
  });
  return (
    <Button
      variant={"ghost"}
      className="rounded-full p-6 [&_svg]:size-6"
      title="Save"
      disabled={handleSaveListing.isPending}
      onClick={() => handleSaveListing.mutate()}
    >
      {isSaved ? <PiStarFill /> : <PiStar />} Save
    </Button>
  );
};

export default SaveListingButton;
