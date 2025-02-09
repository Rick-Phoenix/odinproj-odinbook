import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchListing } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { listingSchema } from "../../types/zod-schemas";
import { notFoundError } from "../../utils/customErrors";

const tags = ["market"];

export const itemId = createRoute({
  path: "/listings/{itemId}",
  method: "get",
  tags,
  request: {
    params: z.object({ itemId: numberParamSchema }),
  },
  responses: {
    [OK]: jsonContent(listingSchema, "The data for the requested listing."),
    [NOT_FOUND]: notFoundError.template,
  },
});

export const itemIdHandler: AppRouteHandler<
  typeof itemId,
  AppBindingsWithUser
> = async (c) => {
  const { itemId } = c.req.valid("param");
  const listing = await fetchListing(itemId);
  if (!listing) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(listing, OK);
};
