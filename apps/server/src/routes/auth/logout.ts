import { userIsAuthenticated } from "@/middlewares/auth-middleware";
import { createRoute, z } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { invalidateSession } from "../../lib/auth";
import type { AppRouteHandler } from "../../types/app-bindings";
import { customError } from "../../utils/customErrors";

const tags = ["auth"];

const errors = {
  userNotLoggedIn: customError(
    {
      message: "User is not logged in.",
    },
    UNAUTHORIZED
  ),
};

export const logout = createRoute({
  path: "/logout",
  method: "post",
  tags,
  responses: {
    [OK]: jsonContent(z.string(), "Success message."),
    [UNAUTHORIZED]: errors.userNotLoggedIn.template,
  },
});

export const logoutHandler: AppRouteHandler<typeof logout> = async (c) => {
  if (!userIsAuthenticated(c) || !c.var.session) {
    return c.json(errors.userNotLoggedIn.content, UNAUTHORIZED);
  }

  await invalidateSession(c, c.var.session.id);
  return c.json("User logged out succesfully.", OK);
};
