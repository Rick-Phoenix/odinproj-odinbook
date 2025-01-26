import { createRoute } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { userIsAuthenticated } from "../../lib/auth";
import { protectRoute } from "../../middlewares/auth-middleware";
import type { AppRouteHandler } from "../../types/app-bindings";
import { userSchema } from "../../types/zod-schemas";
import { accessDeniedError } from "../../utils/customErrors";

const tags = ["user"];

export const userRoot = createRoute({
  path: "/",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(userSchema, "The user data."),
    [UNAUTHORIZED]: accessDeniedError.template,
  },
  middleware: [protectRoute] as const,
});

export const userRootHandler: AppRouteHandler<typeof userRoot> = (c) => {
  if (userIsAuthenticated(c)) {
    const user = c.var.user;
  }
  return c.json(user, OK);
};
