import { createRoute, z } from "@hono/zod-openapi";
import { and, desc, eq, getTableColumns, ne } from "drizzle-orm";
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
  category: z.enum(marketplaceCategories).optional(),
});

export const getSuggestedListings = createRoute({
  path: "/suggested/data",
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

async function fetchSuggestedListings(userId: string, category: MarketplaceCategory | undefined) {
  let suggestedListings;
  if (!category) {
    suggestedListings = await db
      .select({
        ...getTableColumns(listings),
        seller: users.username,
        ...isSaved(userId, listings.id),
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(and(ne(listings.sellerId, userId), eq(listings.sold, false)))
      .orderBy(desc(listings.createdAt))
      .limit(10);
  } else {
    suggestedListings = await db
      .select({
        ...getTableColumns(listings),
        seller: users.username,
        ...isSaved(userId, listings.id),
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(
        and(
          eq(listings.sold, false),
          eq(listings.category, category),
          ne(listings.sellerId, userId)
        )
      )
      .orderBy(desc(listings.createdAt))
      .limit(10);
  }
  return suggestedListings;
}
