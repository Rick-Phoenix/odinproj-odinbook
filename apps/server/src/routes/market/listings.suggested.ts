import { createRoute, z } from "@hono/zod-openapi";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchSuggestedListings } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { listingSchema, marketplaceCategories } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["market"];

const queryInputs = z.object({
  category: z.enum(marketplaceCategories).optional(),
});

export const getSuggestedListings = createRoute({
  path: "/listings/suggested",
  method: "get",
  tags,
  request: {
    query: queryInputs,
  },
  responses: {
    [OK]: jsonContent(
      z.array(listingSchema),
      "The suggested listings for the user."
    ),
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
