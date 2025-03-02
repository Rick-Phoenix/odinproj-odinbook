import { getUserId } from "@/lib/auth";
import { internalServerError, numberParamSchema, okResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { savedListings } from "../../db/schema";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["market"];

export const saveListing = createRoute({
  path: "/{itemId}/save",
  method: "patch",
  tags,
  request: {
    params: z.object({ itemId: numberParamSchema }),
    query: z.object({ action: z.enum(["add", "remove"]) }),
  },
  responses: {
    [OK]: okResponse.template,
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const saveListingHandler: AppRouteHandler<typeof saveListing, AppBindingsWithUser> = async (
  c
) => {
  const userId = getUserId(c);
  const { itemId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  const queryAction =
    action === "add"
      ? await insertSavedListing(userId, itemId)
      : await deleteSavedListing(userId, itemId);
  if (!queryAction) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function insertSavedListing(userId: string, listingId: number) {
  const query = await db.insert(savedListings).values({ userId, listingId });
  return query.rowCount;
}

async function deleteSavedListing(userId: string, listingId: number) {
  const query = await db
    .delete(savedListings)
    .where(and(eq(savedListings.userId, userId), eq(savedListings.listingId, listingId)));
  return query.rowCount;
}
