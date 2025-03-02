import { hashPassword } from "@/lib/auth";
import {
  alreadyLoggedError,
  inputErrorResponse,
  internalServerError,
} from "@/schemas/response-schemas";
import { createRoute } from "@hono/zod-openapi";
import { webcrypto } from "crypto";
import {
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { emailIsNotAvailable, usernameIsNotAvailable } from "../../db/queries";
import { users } from "../../db/schema";
import { createSession } from "../../lib/auth";
import { customError } from "../../schemas/response-schemas";
import { insertUserSchema, userSchema } from "../../schemas/zod-schemas";
import type { AppRouteHandler } from "../../types/app-bindings";

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
    body: jsonContentRequired(insertUserSchema, "The credentials for signing up."),
  },
  responses: {
    [CREATED]: jsonContent(userSchema, "The data for the new user."),
    [CONFLICT]: errors.usernameIsTaken.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(insertUserSchema),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
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

  const [registeredUser] = await db.insert(users).values(hashedUser).returning();
  if (!registeredUser) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  await createSession(c, userId);
  return c.json(registeredUser, CREATED);
};
