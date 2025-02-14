import { createRoute, z } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { updateListing } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["market"];

export const markListingAsSold = createRoute({
  path: "/listings/sold",
  method: "post",
  tags,
  request: {
    body: jsonContent(z.object({ listingId: z.number() }), "The listing id."),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(
      z.object({ listingId: z.number() })
    ),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const markListingAsSoldHandler: AppRouteHandler<
  typeof markListingAsSold,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { listingId } = c.req.valid("json");
  await updateListing(userId, listingId);
  return c.json("OK", OK);
};
