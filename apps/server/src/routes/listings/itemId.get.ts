import { getUserId } from "@/lib/auth";
import { numberParamSchema } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchListing } from "../../db/queries";
import { notFoundError } from "../../schemas/response-schemas";
import { listingSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

export const itemId = createRoute({
  path: "/{itemId}",
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

export const itemIdHandler: AppRouteHandler<typeof itemId, AppBindingsWithUser> = async (c) => {
  const userId = getUserId(c);
  const { itemId } = c.req.valid("param");
  const listing = await fetchListing(userId, itemId);
  if (!listing) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(listing, OK);
};
