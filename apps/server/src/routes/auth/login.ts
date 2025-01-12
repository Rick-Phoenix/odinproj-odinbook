import { createRoute, z } from "@hono/zod-openapi";
import { verifySync } from "@node-rs/argon2";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import type { AppRouteHandler } from "../../types/app-bindings";
import { selectUserSchema } from "../../types/zod-schemas";
import { customError } from "../../utils/customErrors";
import { lowercase } from "../../utils/db-methods";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { createSession } from "../../utils/session";
import { alreadyLoggedError } from "@/utils/customErrors";

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
  userAlreadyLoggedIn: alreadyLoggedError,
};

export const login = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginValidationSchema, "The user's credentials."),
  },
  responses: {
    [OK]: jsonContent(selectUserSchema, "The user object."),
    [NOT_FOUND]: errors.userNotFound.template,
    [BAD_REQUEST]: errors.wrongPassword.template,
    [UNPROCESSABLE_ENTITY]: errors.default,
    [CONFLICT]: errors.userAlreadyLoggedIn.template,
  },
});

export const loginHandler: AppRouteHandler<typeof login> = async (c) => {
  const { username, password } = c.req.valid("json");
  const user = await db.query.userTable.findFirst({
    where(existingUser, { eq }) {
      return eq(lowercase(existingUser.username), username);
    },
  });

  if (!user) {
    return c.json(errors.userNotFound.content, NOT_FOUND);
  }

  if (!user.hash || !verifySync(user.hash, password)) {
    return c.json(errors.wrongPassword.content, BAD_REQUEST);
  }

  await createSession(c, user.id);
  return c.json(user, OK);
};
