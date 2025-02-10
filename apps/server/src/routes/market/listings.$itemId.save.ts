import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { deleteSavedListing, insertSavedListing } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { getUserId } from "../../utils/getters";

const tags = ["market"];

export const saveListing = createRoute({
  path: "/listings/{itemId}/save",
  method: "post",
  tags,
  request: {
    params: z.object({ itemId: numberParamSchema }),
    query: z.object({ action: z.enum(["add", "remove"]) }),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
  },
});

export const saveListingHandler: AppRouteHandler<
  typeof saveListing,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { itemId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  const queryAction =
    action === "add"
      ? insertSavedListing(userId, itemId)
      : deleteSavedListing(userId, itemId);
  await queryAction;
  return c.json("OK", OK);
};
