import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding/dist/base64";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { users } from "../../db/schema";
import { internalServerError } from "../../schemas/response-schemas";
import { updateAvatarSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

export const modifyUserProfile = createRoute({
  path: "/avatar",
  method: "patch",
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
    [OK]: jsonContent(z.object({ newAvatarUrl: z.string() }), "The new avatar url."),
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
  const upload = await cloudinary.uploader.upload(`data:${avatar.type};base64,${base64}`, {
    folder: "Nexus",
    public_id: `user-avatar-${userId}`,
    resource_type: "image",
    overwrite: true,
  });
  const avatarUrl = upload.secure_url;

  const newAvatarUrl = await updateUserAvatar(userId, avatarUrl);
  if (!newAvatarUrl) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(newAvatarUrl, OK);
};

async function updateUserAvatar(userId: string, avatarUrl: string) {
  const [avatar] = await db
    .update(users)
    .set({ avatarUrl })
    .where(eq(users.id, userId))
    .returning({ newAvatarUrl: users.avatarUrl });
  return avatar;
}
