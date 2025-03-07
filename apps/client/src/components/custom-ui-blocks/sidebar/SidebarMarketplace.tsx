import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { Listing, ListingWithSeller } from "../../../lib/db-types";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SidebarHeader, SidebarMenuButton, SidebarSeparator } from "../../ui/sidebar";
import SidebarSkeleton from "./SidebarSkeleton";

const MarketplaceSidebarContent = () => {
  const { itemId } = useParams({ strict: false });
  const queryClient = useQueryClient();

  const { data: listingsCreated } = useQuery<Listing[]>({
    queryKey: ["listingsCreated"],
    initialData: [],
  });

  const { data: listingsSaved } = useQuery<Listing[]>({
    queryKey: ["listingsSaved"],
    initialData: [],
  });

  if (!itemId)
    return (
      <>
        <SidebarHeader className="text-center text-lg font-semibold">Saved Listings</SidebarHeader>
        <ul className="flex flex-col justify-center gap-2 px-2">
          {listingsSaved.length > 0 ? (
            listingsSaved.map((lis) => (
              <SidebarMenuButton
                key={lis.id}
                asChild
                className="size-full transition-colors hover:font-semibold"
              >
                <Link
                  className="flex items-center justify-between gap-2"
                  to="/marketplace/$category/$itemId"
                  params={{ itemId: lis.id, category: lis.category }}
                >
                  <img src={lis.picUrl} className="size-12 min-w-12 rounded-sm object-contain" />
                  <span className="text-ellipsis">{lis.title}</span>
                </Link>
              </SidebarMenuButton>
            ))
          ) : (
            <span className="mx-auto text-xs italic text-muted-foreground md:text-sm">
              The list of saved listings is empty.
            </span>
          )}
        </ul>
        <SidebarSeparator className="mx-0" />
        <SidebarHeader className="text-center text-lg font-semibold">Active Listings</SidebarHeader>
        <ul className="flex flex-col justify-center gap-2 px-2">
          {listingsCreated.length > 0 ? (
            listingsCreated.map((lis) => (
              <SidebarMenuButton
                key={lis.id}
                asChild
                className="size-full transition-colors hover:font-semibold"
              >
                <Link
                  className="flex items-center justify-between gap-2"
                  to="/marketplace/$category/$itemId"
                  params={{ itemId: lis.id, category: lis.category }}
                >
                  <img src={lis.picUrl} className="size-12 min-w-12 rounded-sm object-contain" />
                  <span className="text-ellipsis">{lis.title}</span>
                </Link>
              </SidebarMenuButton>
            ))
          ) : (
            <span className="mx-auto text-xs font-thin italic md:text-sm">
              There are no active listings at the moment.
            </span>
          )}
        </ul>
      </>
    );

  const listing = queryClient.getQueryData<ListingWithSeller>(["listing", itemId]);

  if (!listing) return <SidebarSkeleton />;

  const {
    seller: { username, avatarUrl },
  } = listing;

  return (
    <>
      <div className="p-4 pb-0 text-center text-lg font-semibold">{username}</div>
      <div className="h-32 p-6 pb-0 flex-center">
        <Avatar className="h-full w-auto">
          <AvatarImage
            className="object-cover"
            src={avatarUrl}
            alt={`${username} profile picture`}
          />
        </Avatar>
      </div>
      <div className="p-4 pt-0 text-center text-lg font-semibold">{username}</div>
      <Button className="mx-2" asChild>
        <Link to={"/users/$username"} params={{ username }}>
          View Profile
        </Link>
      </Button>
    </>
  );
};

export default MarketplaceSidebarContent;
