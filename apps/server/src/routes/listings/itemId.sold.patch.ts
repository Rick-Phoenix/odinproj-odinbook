import { getUserId } from "@/lib/auth";
import { inputErrorResponse, okResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import db from "../../db/db-config";
import { listings } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

const inputs = { params: z.object({ itemId: z.number() }) };

export const markListingAsSold = createRoute({
  path: "/{itemId}/sold",
  method: "patch",
  tags,
  request: inputs,
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs.params),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const markListingAsSoldHandler: AppRouteHandler<
  typeof markListingAsSold,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { itemId } = c.req.valid("param");
  const queryResult = await markItemAsSold(userId, itemId);
  if (!queryResult) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};

async function markItemAsSold(userId: string, listingId: number) {
  const query = await db
    .update(listings)
    .set({ sold: true })
    .where(and(eq(listings.sellerId, userId), eq(listings.id, listingId)));

  return query.rowCount;
}
