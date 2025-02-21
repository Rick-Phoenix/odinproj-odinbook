import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC, ReactNode } from "react";
import type { Listing } from "../../lib/api-client";

const ListingPreview: FC<{
  listing: Listing;
  children?: ReactNode;
}> = ({ listing, children }) => {
  return (
    <div className="group size-full p-4">
      <div
        className={`flex h-48 items-center gap-4 rounded-lg border bg-muted p-3 ${listing.sold ? "line-through" : ""}`}
      >
        <Link
          to="/marketplace/$category/$itemId"
          params={{ category: listing.category, itemId: listing.id }}
          className="size-36 justify-self-center p-4"
        >
          <img src={listing.picUrl} className="aspect-square object-contain" />
        </Link>
        <Link
          to="/marketplace/$category/$itemId"
          params={{ category: listing.category, itemId: listing.id }}
          className="flex h-full flex-1 flex-col justify-center gap-2"
        >
          <div className="flex flex-col">
            <span className="line-clamp-1 break-normal text-2xl font-semibold group-hover:underline">
              {listing.title}
            </span>
            <span className="text-accent-foreground">{listing.condition}</span>
            <span className="line-clamp-1 max-w-full break-all text-accent-foreground">
              {listing.location} | {format(new Date(listing.createdAt), "dd MMM y")}
            </span>
          </div>
          <span className="text-xl font-semibold">${listing.price}</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default ListingPreview;
