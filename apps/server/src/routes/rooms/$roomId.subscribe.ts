import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { addSubscription, removeSubscription } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { numberParamSchema } from "../../types/schema-helpers";

const tags = ["rooms"];

export const subscribe = createRoute({
  path: "/{roomId}/subscribe",
  method: "post",
  tags,
  request: {
    params: z.object({ roomId: numberParamSchema }),
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
  const { roomId } = c.req.valid("param");
  const { action } = c.req.valid("query");
  if (action === "add") {
    await addSubscription(userId, roomId);
  } else {
    await removeSubscription(userId, roomId);
  }
  return c.json("OK", OK);
};
