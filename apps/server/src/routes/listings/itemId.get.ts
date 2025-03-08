import { createRoute, z } from "@hono/zod-openapi";
import { eq, getTableColumns } from "drizzle-orm";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { listings, users } from "../../db/schema";
import { isSaved } from "../../db/subqueries";
import { getUserId } from "../../lib/auth";
import { notFoundError, numberParamSchema } from "../../schemas/response-schemas";
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
    [OK]: jsonContent(
      listingSchema.extend({ seller: z.object({ username: z.string(), avatarUrl: z.string() }) }),
      "The data for the requested listing."
    ),
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

async function fetchListing(userId: string, id: number) {
  const [listing] = await db
    .select({
      ...getTableColumns(listings),
      seller: { username: users.username, avatarUrl: users.avatarUrl },
      ...isSaved(userId, listings.id),
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(eq(listings.id, id));

  return listing;
}
