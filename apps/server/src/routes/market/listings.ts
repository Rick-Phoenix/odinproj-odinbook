import { createRoute, z } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding";
import { v2 as cloudinary } from "cloudinary";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchListingsByCategory, insertListing } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import {
  insertListingSchema,
  listingSchema,
  marketplaceCategories,
} from "../../types/zod-schemas";
import { internalServerError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["market"];

const queryInputs = z.object({
  category: z.enum(marketplaceCategories),
  orderBy: z.enum(["cheapest", "mostRecent"]),
});

export const getListings = createRoute({
  path: "/listings",
  method: "get",
  tags,
  request: {
    query: queryInputs,
  },
  responses: {
    [OK]: jsonContent(
      z.array(listingSchema),
      "The listings belonging to the selected category."
    ),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(queryInputs),
  },
});

export const getListingsHandler: AppRouteHandler<
  typeof getListings,
  AppBindingsWithUser
> = async (c) => {
  const { category, orderBy } = c.req.valid("query");
  const userId = getUserId(c);
  const listings = await fetchListingsByCategory(userId, category, orderBy);
  return c.json(listings, OK);
};

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
    [OK]: jsonContent(
      listingSchema.omit({ isSaved: true }),
      "The newly created listing."
    ),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertListingSchema),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const createListingHandler: AppRouteHandler<
  typeof createListing,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { pic, ...inputs } = c.req.valid("form");
  let picUrl;

  if (pic) {
    const file = await pic.arrayBuffer();
    const fileBuffer = Buffer.from(file);
    const base64 = encodeBase64(fileBuffer);
    const upload = await cloudinary.uploader.upload(
      `data:${pic.type};base64,${base64}`,
      {
        folder: "Nexus",
        public_id: pic.name,
        resource_type: "image",
      }
    );
    picUrl = upload.secure_url;
  }

  const listing = await insertListing({
    sellerId: userId,
    ...inputs,
    picUrl,
  });
  if (!listing)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(listing, OK);
};
