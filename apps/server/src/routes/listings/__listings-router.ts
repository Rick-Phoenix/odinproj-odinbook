import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getListings, getListingsHandler } from "./_listings-index.get";
import { createListing, createListingHandler } from "./_listings-index.post";
import { deleteListing, deleteListingHandler } from "./itemId.delete";
import { itemId, itemIdHandler } from "./itemId.get";
import { markListingAsSold, markListingAsSoldHandler } from "./itemId.sold.patch";
import { saveListing, saveListingHandler } from "./savedListings.itemId.post";
import { getSuggestedListings, getSuggestedListingsHandler } from "./suggested.get";

export const listingsRouter = createRouter<AppBindingsWithUser>()
  .openapi(createListing, createListingHandler)
  .openapi(itemId, itemIdHandler)
  .openapi(getListings, getListingsHandler)
  .openapi(saveListing, saveListingHandler)
  .openapi(getSuggestedListings, getSuggestedListingsHandler)
  .openapi(deleteListing, deleteListingHandler)
  .openapi(markListingAsSold, markListingAsSoldHandler);
