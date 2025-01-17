import { createRoute } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";
import { userSchema } from "../../types/zod-schemas";
import { accessDeniedError } from "../../utils/customErrors";

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

export const homeHandler: AppRouteHandler<typeof home> = async (c) => {
  const user = c.var.user!;
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
  return c.json(user, OK);
};
