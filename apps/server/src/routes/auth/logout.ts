import { createRoute } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { invalidateSession } from "../../lib/auth";
import { customError, okResponse } from "../../schemas/response-schemas";
import type { AppRouteHandler } from "../../types/app-bindings";

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
    [OK]: okResponse.template,
    [UNAUTHORIZED]: errors.userNotLoggedIn.template,
  },
});

export const logoutHandler: AppRouteHandler<typeof logout> = async (c) => {
  if (!c.var.user || !c.var.session) {
    return c.json(errors.userNotLoggedIn.content, UNAUTHORIZED);
  }

  await invalidateSession(c, c.var.session.id);
  return c.json(okResponse.content, OK);
};
