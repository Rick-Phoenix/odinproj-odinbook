import { createRoute, z } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding/dist/base64";
import { v2 as cloudinary } from "cloudinary";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { updateUserAvatar } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { updateAvatarSchema } from "../../types/zod-schemas";
import {
  accessDeniedError,
  internalServerError,
} from "../../utils/customErrors";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["users"];

export const modifyUserProfile = createRoute({
  path: "/edit/avatar",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: updateAvatarSchema,
        },
      },
    },
  },
  responses: {
    [OK]: jsonContent(
      z.object({ newAvatarUrl: z.string() }),
      "The new avatar url."
    ),
    [UNAUTHORIZED]: accessDeniedError.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(updateAvatarSchema),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const modifyUserProfileHandler: AppRouteHandler<
  typeof modifyUserProfile,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const { avatar } = c.req.valid("form");

  const file = await avatar.arrayBuffer();
  const fileBuffer = Buffer.from(file);
  const base64 = encodeBase64(fileBuffer);
  const upload = await cloudinary.uploader.upload(
    `data:${avatar.type};base64,${base64}`,
    {
      folder: "Nexus",
      public_id: `user-avatar-${userId}`,
      resource_type: "image",
      overwrite: true,
    }
  );
  const avatarUrl = upload.secure_url;

  const newAvatarUrl = await updateUserAvatar(userId, avatarUrl);
  if (!newAvatarUrl)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(newAvatarUrl, OK);
};
