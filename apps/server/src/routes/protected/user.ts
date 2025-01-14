import { createRoute, z } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";
import { accessDeniedError } from "../../utils/customErrors";
import { userSchema } from "../../types/zod-schemas";

const tags = ["protected"];

export const home = createRoute({
  path: "/user",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(userSchema, "The user data."),
    [UNAUTHORIZED]: accessDeniedError.template,
  },
});

export const homeHandler: AppRouteHandler<typeof home> = (c) => {
  const user = c.var.user!;
  return c.json(user, OK);
};
