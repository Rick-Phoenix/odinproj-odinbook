import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { useToast } from "../../../hooks/useToast";
import type { Listing } from "../../../lib/db-types";
import { api } from "../../../lib/hono-RPC";
import { Button } from "../../ui/button";

const SaveListingButton: FC<{ listing: Listing; inPreview?: boolean }> = ({
  listing,
  inPreview,
}) => {
  const [isSaved, setIsSaved] = useState(listing.isSaved);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const handleSaveListing = useMutation({
    mutationKey: ["savedListing", listing.id],
    mutationFn: async () => {
      const action = isSaved ? "remove" : "add";
      const res = await api.listings[":itemId"].save.$patch({
        param: { itemId: listing.id },
        query: { action },
      });
      if (!res.ok) {
        throw new Error("Error while saving or removing this listing.");
      }
      const data = await res.json();
      return action;
    },
    onSuccess: (action) => {
      queryClient.setQueryData(["listingsSaved"], (old: Listing[]) => {
        return isSaved
          ? old.filter((lis) => lis.id !== listing.id)
          : [{ ...listing, isSaved: true }, ...old];
      });
      queryClient.setQueryData(["listing"], { ...listing, isSaved: !isSaved });
      setIsSaved((old) => !old);
      toast({
        title: action === "add" ? "Listing saved successfully." : "Listing removed from favorites.",
      });
    },
  });
  const className = inPreview
    ? "rounded-full  [&_svg]:size-8 hover:bg-muted-foreground/50"
    : "rounded-full  [&_svg]:size-6";
  return (
    <Button
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
