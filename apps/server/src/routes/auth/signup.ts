import { createRoute, z } from "@hono/zod-openapi";
import { webcrypto } from "crypto";
import { OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import db from "../../db/dbConfig";
import { userTable } from "../../db/schema";
import type { AppRouteHandler } from "../../types/app-bindings";
import { signupUserSchema } from "../../types/zod-schemas";
import { hashPassword } from "../../utils/password";
import { createSession } from "../../utils/session";
import { setCookie } from "hono/cookie";

const tags = ["auth"];

export const signup = createRoute({
  path: "/signup",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      signupUserSchema,
      "The credentials for signing up."
    ),
  },
  responses: {
    [OK]: jsonContent(z.string(), "Success message."),
    [UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(signupUserSchema),
      "The validation error(s)."
    ),
  },
});

export const signupHandler: AppRouteHandler<typeof signup> = async (c) => {
  const user = c.req.valid("json");
  const { password, ...rest } = user;
  const userId = webcrypto.randomUUID();
  const hashedUser = {
    hash: await hashPassword(password),
    id: userId,
    ...rest,
  };
  await db.insert(userTable).values(hashedUser);
  await createSession(c, userId);
  return c.json("success.", OK);
};
