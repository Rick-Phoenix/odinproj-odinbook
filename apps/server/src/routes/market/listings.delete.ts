import { createRoute, z } from "@hono/zod-openapi";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { removeListing } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { internalServerError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["market"];

export const deleteListing = createRoute({
  path: "/listings/delete",
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

export const deleteListingHandler: AppRouteHandler<
  typeof deleteListing,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { listingId } = c.req.valid("json");
  await removeListing(userId, listingId);
  return c.json("OK", OK);
};
