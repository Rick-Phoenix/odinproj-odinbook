import { getUserId } from "@/lib/auth";
import { inputErrorResponse, numberParamSchema, okResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { listings } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

const inputs = z.object({ listingId: numberParamSchema });

export const deleteListing = createRoute({
  path: "/{itemId}",
  method: "delete",
  tags,
  request: {
    params: inputs,
  },
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const deleteListingHandler: AppRouteHandler<
  typeof deleteListing,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { listingId } = c.req.valid("param");
  const removal = await removeListing(userId, listingId);
  if (!removal) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

export async function removeListing(userId: string, listingId: number) {
  const query = await db
    .delete(listings)
    .where(and(eq(listings.sellerId, userId), eq(listings.id, listingId)));
  return query.rowCount;
}
