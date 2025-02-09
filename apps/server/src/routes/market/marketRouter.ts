import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { createListing, createListingHandler } from "./listings";

export const marketRouter = createRouter<AppBindingsWithUser>().openapi(
  createListing,
  createListingHandler
);
