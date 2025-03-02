import { createRoute } from "@hono/zod-openapi";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchUserData } from "../../db/queries";
import { accessDeniedError } from "../../schemas/response-schemas";
import { userDataSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

export const user = createRoute({
  path: "/user",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(userDataSchema, "The user data."),
    [UNAUTHORIZED]: accessDeniedError.template,
  },
});

export const userHandler: AppRouteHandler<typeof user, AppBindingsWithUser> = async (c) => {
  const { id } = c.var.user;
  const user = await fetchUserData(id);
  return c.json(user, OK);
};
