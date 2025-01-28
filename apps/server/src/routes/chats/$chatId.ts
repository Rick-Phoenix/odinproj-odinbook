import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { getSingleChat } from "../../db/queries";
import {
  jsonS,
  type AppBindingsWithUser,
  type AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";
import { chatSchema } from "../../types/zod-schemas";
import { badRequestError } from "../../utils/customErrors";

const tags = ["chats"];

export const chatId = createRoute({
  path: "/{chatId}",
  method: "get",
  tags,
  request: {
    params: z.object({
      chatId: numberParamSchema,
    }),
  },
  responses: {
    [OK]: jsonContent(chatSchema, "The requested chat."),
    [BAD_REQUEST]: badRequestError.template,
  },
});

export const chatIdHandler: AppRouteHandler<
  typeof chatId,
  AppBindingsWithUser
> = async (c) => {
  const { chatId } = c.req.valid("param");
  const { id: userId } = c.var.user;
  const chat = await getSingleChat(userId, chatId);
  console.log("🚀 ~ file: $chatId.ts:37 ~ >= ~ chat:", chat);
  if (!chat) return c.json(badRequestError.content, BAD_REQUEST);

  return jsonS(c, chat, 200);
};
