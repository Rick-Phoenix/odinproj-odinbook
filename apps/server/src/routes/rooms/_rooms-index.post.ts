import { getUserId } from "@/lib/auth";
import { inputErrorResponse } from "@/schemas/response-schemas";
import { createRoute } from "@hono/zod-openapi";
import { encodeBase64 } from "@oslojs/encoding";
import { v2 as cloudinary } from "cloudinary";
import { CONFLICT, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { type RoomCategories, rooms } from "../../db/schema";
import { customError } from "../../schemas/response-schemas";
import { insertRoomSchema, roomSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["rooms"];

const roomExistsError = customError(
  { message: "A room with this name already exists.", path: ["name"] },
  CONFLICT
);

export const createRoom = createRoute({
  path: "/",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: insertRoomSchema,
        },
      },
    },
  },
  responses: {
    [OK]: jsonContent(roomSchema, "The created room."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertRoomSchema),
    [CONFLICT]: roomExistsError.template,
  },
});

export const createRoomHandler: AppRouteHandler<typeof createRoom, AppBindingsWithUser> = async (
  c
) => {
  const userId = getUserId(c);
  const { name, category } = c.req.valid("form");
  const parseBody = await c.req.parseBody();
  const avatar = parseBody["avatar"] as File;
  let avatarUrl;

  if (avatar) {
    const file = await avatar.arrayBuffer();
    const fileBuffer = Buffer.from(file);
    const base64 = encodeBase64(fileBuffer);
    const upload = await cloudinary.uploader.upload(`data:${avatar.type};base64,${base64}`, {
      folder: "Nexus",
      public_id: `room-avatar-${name}`,
      resource_type: "image",
    });
    avatarUrl = upload.secure_url;
  }
  const room = await insertRoom(userId, name, category, avatarUrl);
  if (room === undefined) return c.json(roomExistsError.content, CONFLICT);
  return c.json({ ...room, isSubscribed: true }, OK);
};

async function insertRoom(userId: string, name: string, category: RoomCategories, avatar?: string) {
  const [room] = await db
    .insert(rooms)
    .values({ creatorId: userId, name, category, avatar })
    .onConflictDoNothing()
    .returning();
  return room as typeof room | undefined;
}
