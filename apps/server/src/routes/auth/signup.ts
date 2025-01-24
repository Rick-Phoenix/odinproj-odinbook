import { alreadyLoggedError } from "@/utils/customErrors";
import { createRoute } from "@hono/zod-openapi";
import { webcrypto } from "crypto";
import {
  CONFLICT,
  CREATED,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { emailIsNotAvailable, usernameIsNotAvailable } from "../../db/queries";
import { usersTable } from "../../db/schema";
import type { AppRouteHandler } from "../../types/app-bindings";
import { signupValidationSchema, userSchema } from "../../types/zod-schemas";
import { customError } from "../../utils/customErrors";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { hashPassword } from "../../utils/password";
import { createSession } from "../../utils/session";

const tags = ["auth"];

const errors = {
  usernameIsTaken: customError(
    {
      message: "This username is already taken.",
      path: ["username"],
    },
    CONFLICT
  ),
  emailIsTaken: customError(
    {
      message: "This email is already connected to another user.",
      path: ["email"],
    },
    CONFLICT
  ),
  userIsLoggedIn: alreadyLoggedError,
};

export const signup = createRoute({
  path: "/signup",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      signupValidationSchema,
      "The credentials for signing up."
    ),
  },
  responses: {
    [CREATED]: jsonContent(userSchema, "Success message."),
    [CONFLICT]: errors.usernameIsTaken.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(signupValidationSchema),
  },
});

export const signupHandler: AppRouteHandler<typeof signup> = async (c) => {
  const user = c.req.valid("json");
  if (await usernameIsNotAvailable(user.username)) {
    return c.json(errors.usernameIsTaken.content, CONFLICT);
  }

  if (await emailIsNotAvailable(user.email)) {
    return c.json(errors.emailIsTaken.content, CONFLICT);
  }

  const { password, ...rest } = user;
  const userId = webcrypto.randomUUID();
  const hashedUser = {
    hash: await hashPassword(password),
    id: userId,
    ...rest,
  };

  const [registeredUser] = await db
    .insert(usersTable)
    .values(hashedUser)
    .returning();
  await createSession(c, userId);
  return c.json(registeredUser, CREATED);
};
