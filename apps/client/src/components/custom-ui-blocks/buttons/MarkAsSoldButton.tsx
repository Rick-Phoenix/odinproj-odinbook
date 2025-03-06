import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeDollarSign } from "lucide-react";
import { type FC } from "react";
import type { Listing } from "../../../lib/db-types";
import { api } from "../../../lib/hono-RPC";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

const MarkAsSoldButton: FC<{
  listing: Listing;
  withText?: boolean;
}> = ({ listing, withText }) => {
  const queryClient = useQueryClient();
  const handleMarkAsSold = useMutation({
    mutationKey: ["listingCreated", listing.id],
    mutationFn: async () => {
      const res = await api.listings[":itemId"].sold.$patch({
        param: { itemId: listing.id },
      });
      if (!res.ok) {
        throw new Error("Error while saving or removing this listing.");
      }
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["listingsCreated"], (old: Listing[]) =>
        old.filter((lis) => lis.id !== listing.id)
      );
      queryClient.setQueryData(["listing", listing.id], {
        ...listing,
        isSold: true,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={
            "w-fit rounded-full p-3 text-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 [&_svg]:size-6"
          }
          title="Mark as sold"
        >
          <BadgeDollarSign /> {withText && "Sold"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to mark this listing as sold?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={handleMarkAsSold.isPending}
            onClick={() => handleMarkAsSold.mutate()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MarkAsSoldButton;
