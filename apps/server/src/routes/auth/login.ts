import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../../lib/create-app";
import { httpCodes, notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";

const tags = ["auth"];

export const login = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
      "The user's credentials."
    ),
  },
  responses: {
    [httpCodes.OK]: jsonContent(z.string(), "The session data."),
  },
});

export const loginHandler: AppRouteHandler<typeof login> = (c) => {
  return c.json("sessionData");
};
