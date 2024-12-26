import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["users"];

export const usersRoute = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.string().openapi({})),
      "Returns all the users"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.array(z.string())),
      "The validation error(s)."
    ),
  },
});

export type UsersRoute = typeof usersRoute;
