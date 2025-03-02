import { getUserId } from "@/lib/auth";
import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { updateListing } from "../../db/queries";
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
    [OK]: jsonContent(z.string(), "A confirmation message."),
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
  await updateListing(userId, itemId);
  return c.json("OK", OK);
};
