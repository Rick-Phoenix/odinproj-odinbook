import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { addSubscription, removeSubscription } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";

const tags = ["rooms"];

export const subscribe = createRoute({
  path: "/{roomName}/subscribe",
  method: "post",
  tags,
  request: {
    params: z.object({ roomName: z.string() }),
    query: z.object({ action: z.enum(["add", "remove"]) }),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
  },
});

export const subscribeHandler: AppRouteHandler<
  typeof subscribe,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId } = c.var.user;
  const { roomName } = c.req.valid("param");
  const { action } = c.req.valid("query");
  if (action === "add") {
    await addSubscription(userId, roomName);
  } else {
    await removeSubscription(userId, roomName);
  }
  return c.json("OK", OK);
};
