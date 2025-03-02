import { getUserId } from "@/lib/auth";
import { numberParamSchema, okResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { deleteSavedListing, insertSavedListing } from "../../db/queries";
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
  },
});

export const saveListingHandler: AppRouteHandler<typeof saveListing, AppBindingsWithUser> = async (
  c
) => {
  const userId = getUserId(c);
  const { itemId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  const queryAction =
    action === "add" ? insertSavedListing(userId, itemId) : deleteSavedListing(userId, itemId);
  await queryAction;
  return c.json(okResponse.content, OK);
};
