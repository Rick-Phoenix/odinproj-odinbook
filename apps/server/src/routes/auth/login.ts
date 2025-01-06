import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../../lib/create-app";
import { httpCodes, notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { sessionSchema } from "../../types/zod-schemas";
import type { AppRouteHandler } from "../../types/app-bindings";
import type { SessionData } from "hono-sessions";

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
    [httpCodes.OK]: jsonContent(sessionSchema, "The session data."),
  },
});

export const loginHandler: AppRouteHandler<typeof login> = (c) => {
  const session = c.get("session");
  session.set("user", "2");
  console.log(c.req.header("Cookie"));
  const sessionData = session as unknown as SessionData;
  return c.json(sessionData);
};
