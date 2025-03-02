import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeDollarSign } from "lucide-react";
import { type FC } from "react";
import { api, type Listing } from "../../../lib/api-client";
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
}> = ({ listing }) => {
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
          variant={"ghost"}
          className={"rounded-full p-6 hover:bg-muted-foreground/50 [&_svg]:size-8"}
          title="Mark as sold"
        >
          <BadgeDollarSign />
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
