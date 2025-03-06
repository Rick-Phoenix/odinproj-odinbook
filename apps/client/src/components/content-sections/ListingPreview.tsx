import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { FC, ReactNode } from "react";
import type { Listing } from "../../lib/db-types";

const ListingPreview: FC<{
  listing: Listing;
  children?: ReactNode;
}> = ({ listing, children }) => {
  return (
    <div className="size-full px-4">
      <div
        className={`group flex h-36 items-center rounded-lg border bg-muted/90 p-3 transition-colors hover:bg-muted md:h-48 ${listing.sold ? "line-through" : ""}`}
      >
        <Link
          to="/marketplace/$category/$itemId"
          params={{ category: listing.category, itemId: listing.id }}
          className="size-20 min-w-20 self-center justify-self-center p-2 pl-0 md:size-36 md:min-w-36"
        >
          <img src={listing.picUrl} className="aspect-square rounded-sm object-contain" />
        </Link>
        <Link
          to="/marketplace/$category/$itemId"
          params={{ category: listing.category, itemId: listing.id }}
          className="flex h-full flex-1 flex-col justify-center gap-2"
        >
          <div className="flex flex-1 flex-col justify-center pl-2 md:px-4">
            <span className="line-clamp-2 break-words font-semibold group-hover:underline md:text-2xl">
              {listing.title}
            </span>
            <span className="text-sm text-accent-foreground">{listing.condition}</span>
            <span className="line-clamp-1 max-w-full break-all text-sm text-accent-foreground">
              {listing.location} | {format(new Date(listing.createdAt), "dd MMM y")}
            </span>
            <span className="font-semibold md:text-xl">${listing.price}</span>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default ListingPreview;
