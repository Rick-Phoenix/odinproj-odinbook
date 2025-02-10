import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import {
  createListing,
  createListingHandler,
  getListings,
  getListingsHandler,
} from "./listings";
import { itemId, itemIdHandler } from "./listings.$itemId";

export const marketRouter = createRouter<AppBindingsWithUser>()
  .openapi(createListing, createListingHandler)
  .openapi(itemId, itemIdHandler)
  .openapi(getListings, getListingsHandler);
