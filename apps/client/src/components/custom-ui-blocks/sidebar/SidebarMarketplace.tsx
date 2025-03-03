import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { Listing } from "../../../lib/db-types";
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
          {listingsSaved.map((lis) => (
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
          ))}
        </ul>
        <SidebarSeparator className="mx-0" />
        <SidebarHeader className="text-center text-lg font-semibold">Active Listings</SidebarHeader>
        <ul className="flex flex-col justify-center gap-2 px-2">
          {listingsCreated.map((lis) => (
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
          ))}
        </ul>
      </>
    );

  const listing = queryClient.getQueryData<Listing>(["listing", itemId]);

  if (!listing) return <SidebarSkeleton />;

  const { picUrl, seller } = listing;

  return (
    <>
      <div className="p-4 pb-0 text-center text-lg font-semibold">{seller}</div>
      <div className="h-32 p-6 pb-0 flex-center">
        <Avatar className="h-full w-auto">
          <AvatarImage className="object-cover" src={picUrl} alt={`${seller} profile picture`} />
        </Avatar>
      </div>
      <div className="p-4 pt-0 text-center text-lg font-semibold">{seller}</div>
      <Button className="mx-2" asChild>
        <Link to={"/users/$username"} params={{ username: seller }}>
          View Profile
        </Link>
      </Button>
    </>
  );
};

export default MarketplaceSidebarContent;
