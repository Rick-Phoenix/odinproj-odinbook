import { createRoute, z } from "@hono/zod-openapi";
import { and, asc, desc, eq, getTableColumns } from "drizzle-orm";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { type MarketplaceCategory, listings, users } from "../../db/schema";
import { isSaved } from "../../db/subqueries";
import { getUserId } from "../../lib/auth";
import { inputErrorResponse } from "../../schemas/response-schemas";
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

async function fetchListingsByCategory(
  userId: string,
  category: MarketplaceCategory,
  orderBy: "cheapest" | "mostRecent"
) {
  const listingsByCategory = await db
    .select({
      ...getTableColumns(listings),
      seller: users.username,
      ...isSaved(userId, listings.id),
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(and(eq(listings.sold, false), eq(listings.category, category)))
    .orderBy(orderBy === "cheapest" ? asc(listings.price) : desc(listings.createdAt));
  return listingsByCategory;
}
