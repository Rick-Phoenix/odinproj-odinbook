import { createRoute } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding";
import { v2 as cloudinary } from "cloudinary";
import { eq, sql } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { withCTEColumns } from "../../db/db-methods";
import { listings, users } from "../../db/schema";
import { getUserId } from "../../lib/auth";
import { inputErrorResponse, internalServerError } from "../../schemas/response-schemas";
import { insertListingSchema, listingSchema, type ListingInputs } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["listings"];

export const createListing = createRoute({
  path: "/",
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
    [OK]: jsonContent(listingSchema.omit({ isSaved: true }), "The newly created listing."),
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
    const upload = await cloudinary.uploader.upload(`data:${pic.type};base64,${base64}`, {
      folder: "Nexus",
      public_id: pic.name,
      resource_type: "image",
    });
    picUrl = upload.secure_url;
  }

  const listing = await insertListing({
    sellerId: userId,
    ...inputs,
    picUrl,
  });
  if (!listing) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(listing, OK);
};

async function insertListing(inputs: { sellerId: string } & ListingInputs) {
  const insertQuery = db
    .$with("inserted_listing")
    .as(db.insert(listings).values(inputs).returning());
  const [listing] = await db
    .with(insertQuery)
    .select({
      ...withCTEColumns(listings, insertQuery),
      seller: users.username,
      isSaved: sql<boolean>`${false}`,
    })
    .from(insertQuery)
    .innerJoin(users, eq(users.id, insertQuery.sellerId));
  return listing;
}
