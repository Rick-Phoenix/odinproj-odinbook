import { createRoute } from "@hono/zod-openapi";
import type { AppRouteHandler } from "../../types/app-bindings";

const tags = ["chat"];

export const chatId = createRoute({
  path: "/:chatId",
  method: "get",
  tags,
  request: {},
  responses: {
    // [OK]: ,
  },
});

export const chatIdHandler: AppRouteHandler<typeof chatId> = (c) => {};
