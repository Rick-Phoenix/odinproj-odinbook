import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { api, type Listing } from "../../lib/api-client";
import { Button } from "../ui/button";

const SaveListingButton: FC<{ listing: Listing; inPreview?: boolean }> = ({ listing, inPreview }) => {
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
        return isSaved ? old.filter((lis) => lis.id !== listing.id) : [{ ...listing, isSaved: true }, ...old];
      });
      queryClient.setQueryData(["listing"], { ...listing, isSaved: !isSaved });
      setIsSaved((old) => !old);
    },
  });
  const className = inPreview
    ? "rounded-full p-6 [&_svg]:size-8 hover:bg-muted-foreground/50"
    : "rounded-full p-6 [&_svg]:size-6";
  return (
    <Button
      variant={"ghost"}
      className={className}
      title="Save"
      disabled={handleSaveListing.isPending}
      onClick={() => handleSaveListing.mutate()}
    >
      {isSaved ? <PiStarFill /> : <PiStar />} {!inPreview && "Save"}
    </Button>
  );
};

export default SaveListingButton;
