import { createRoute } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { userSchema } from "../../types/zod-schemas";
import { accessDeniedError } from "../../utils/customErrors";

const tags = ["users"];

export const user = createRoute({
  path: "/user",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(userSchema, "The user data."),
    [UNAUTHORIZED]: accessDeniedError.template,
  },
});

export const userHandler: AppRouteHandler<typeof user, AppBindingsWithUser> = (
  c
) => {
  const user = c.var.user;
  return c.json(user, OK);
};
