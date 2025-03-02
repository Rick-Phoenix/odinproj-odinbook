import { getUserId } from "@/lib/auth";
import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchSuggestedListings } from "../../db/queries";
import { listingSchema, marketplaceCategories } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

const queryInputs = z.object({
  category: z.enum(marketplaceCategories).optional(),
});

export const getSuggestedListings = createRoute({
  path: "/suggested",
  method: "get",
  tags,
  request: {
    query: queryInputs,
  },
  responses: {
    [OK]: jsonContent(z.array(listingSchema), "The suggested listings for the user."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(queryInputs),
  },
});

export const getSuggestedListingsHandler: AppRouteHandler<
  typeof getSuggestedListings,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { category } = c.req.valid("query");
  const listings = await fetchSuggestedListings(userId, category);
  return c.json(listings, OK);
};
