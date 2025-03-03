import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { type FC } from "react";
import { useToast } from "../../../hooks/useToast";
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

const DeleteListingButton: FC<{
  listing: Listing;
  withText?: boolean;
}> = ({ listing, withText }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleDeleteListing = useMutation({
    mutationKey: ["listingCreated", listing.id],
    mutationFn: async () => {
      const res = await api.listings[":itemId"].$delete({
        param: { listingId: listing.id },
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
      queryClient.setQueryData(["listing", listing.id], null);
      toast({ title: "Listing cancelled successfully.", duration: 2000 });
      navigate({ to: "/marketplace" });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"ghost"}
          className={"rounded-full p-6 text-xl hover:bg-muted-foreground/50 [&_svg]:size-8"}
          title="Remove Listing"
        >
          <X /> {withText && "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={handleDeleteListing.isPending}
            onClick={() => handleDeleteListing.mutate()}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteListingButton;
