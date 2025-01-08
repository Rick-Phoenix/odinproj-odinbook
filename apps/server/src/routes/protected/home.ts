import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";

const tags = ["protected"];

export const home = createRoute({
  path: "/home",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(z.string(), "Test"),
  },
});

export const homeHandler: AppRouteHandler<typeof home> = (c) => {
  const user = c.get("user");
  return c.json(`Hello, ${user?.username}!`, OK);
};
