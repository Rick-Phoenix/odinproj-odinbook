import { getUserId } from "@/lib/auth";
import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchListingsByCategory } from "../../db/queries";
import { listingSchema, marketplaceCategories } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

const queryInputs = z.object({
  category: z.enum(marketplaceCategories),
  orderBy: z.enum(["cheapest", "mostRecent"]),
});

export const getListings = createRoute({
  path: "/",
  method: "get",
  tags,
  request: {
    query: queryInputs,
  },
  responses: {
    [OK]: jsonContent(z.array(listingSchema), "The listings belonging to the selected category."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(queryInputs),
  },
});

export const getListingsHandler: AppRouteHandler<typeof getListings, AppBindingsWithUser> = async (
  c
) => {
  const { category, orderBy } = c.req.valid("query");
  const userId = getUserId(c);
  const listings = await fetchListingsByCategory(userId, category, orderBy);
  return c.json(listings, OK);
};
