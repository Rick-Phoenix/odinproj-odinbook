import { createRoute } from "@hono/zod-openapi";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { insertListingSchema, listingSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["market"];

export const createListing = createRoute({
  path: "/listings",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: insertListingSchema,
        },
      },
    },
  },
  responses: {
    [OK]: jsonContent(listingSchema, "The newly created listing."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertListingSchema),
  },
});

export const createListingHandler: AppRouteHandler<
  typeof createListing,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const reqBody = c.req.valid("form");
  return c.json("OK", OK);
};
