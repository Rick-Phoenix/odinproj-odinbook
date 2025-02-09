import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { createListing, createListingHandler } from "./listings";
import { itemId, itemIdHandler } from "./listings.$itemId";

export const marketRouter = createRouter<AppBindingsWithUser>()
  .openapi(createListing, createListingHandler)
  .openapi(itemId, itemIdHandler);
