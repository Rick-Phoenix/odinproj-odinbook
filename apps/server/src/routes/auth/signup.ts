import { createRoute, z } from "@hono/zod-openapi";
import { webcrypto } from "crypto";
import { createInsertSchema } from "drizzle-zod";
import {
  CONFLICT,
  CREATED,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import db from "../../db/dbConfig";
import { emailIsNotAvailable, usernameIsNotAvailable } from "../../db/queries";
import { userTable } from "../../db/schema";
import type { AppRouteHandler } from "../../types/app-bindings";
import { selectUserSchema } from "../../types/zod-schemas";
import { customError } from "../../utils/customErrors";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { hashPassword } from "../../utils/password";
import { createSession, userIsAuthenticated } from "../../utils/session";
import { alreadyLoggedError } from "@/utils/customErrors";

const tags = ["auth"];

export const signupUserSchema = createInsertSchema(userTable)
  .pick({ username: true, email: true })
  .extend({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long.")
      .max(31, "Username cannot be longer than 31 characters.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain alphanumeric characters, dashes and underscores."
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long.")
      .max(63, "Email cannot be longer than 63 characters.")
      .regex(/[^<>"']/, "Email contains invalid characters."),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ .%^&*-]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, a number and a special character."
      )
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password cannot be longer than 255 characters."),
  });

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
      signupUserSchema,
      "The credentials for signing up."
    ),
  },
  responses: {
    [CREATED]: jsonContent(selectUserSchema, "Success message."),
    [CONFLICT]: errors.usernameIsTaken.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(signupUserSchema),
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
    .insert(userTable)
    .values(hashedUser)
    .returning();
  await createSession(c, userId);
  return c.json(registeredUser, CREATED);
};
