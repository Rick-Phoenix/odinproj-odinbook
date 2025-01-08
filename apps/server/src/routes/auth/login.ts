import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";
import { customError } from "../../utils/customError";
import { hashPassword } from "../../utils/password";
import db from "../../db/dbConfig";
import { lowercase } from "../../utils/db-methods";
import { createSession } from "../../utils/session";
import { inputErrorResponse } from "../../utils/inputErrorResponse";

const tags = ["auth"];

export const loginValidationSchema = z.object({
  username: z.string().trim().toLowerCase(),
  password: z.string(),
});

const errors = {
  userNotFound: customError(
    {
      path: ["username"],
      message: "This user does not exist.",
    },
    NOT_FOUND
  ),
  wrongPassword: customError(
    {
      path: ["password"],
      message: "Incorrect password.",
    },
    BAD_REQUEST
  ),
  default: inputErrorResponse(loginValidationSchema),
};

export const login = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginValidationSchema, "The user's credentials."),
  },
  responses: {
    [OK]: jsonContent(z.string(), "The session data."),
    [NOT_FOUND]: errors.userNotFound.template,
    [BAD_REQUEST]: errors.wrongPassword.template,
    [UNPROCESSABLE_ENTITY]: errors.default,
  },
});

export const loginHandler: AppRouteHandler<typeof login> = async (c) => {
  const { username, password } = c.req.valid("json");

  const hash = await hashPassword(password);
  const user = await db.query.userTable.findFirst({
    where(existingUser, { eq }) {
      return eq(lowercase(existingUser.username), username);
    },
  });

  if (!user) {
    return c.json(errors.userNotFound.content, NOT_FOUND);
  }

  if (user.hash !== hash) {
    return c.json(errors.wrongPassword.content, BAD_REQUEST);
  }

  await createSession(c, user.id);
  return c.json("Success.", OK);
};
