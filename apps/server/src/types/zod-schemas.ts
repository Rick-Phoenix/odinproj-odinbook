import { z } from "@hono/zod-openapi";
import { usernameIsAvailable, emailIsAvailable } from "../db/queries";
import { userTable } from "../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { hasPwBeenPwned } from "../utils/password";

export const signupUserSchema = createInsertSchema(userTable)
  .pick({ username: true, email: true })
  .extend({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long.")
      .max(32, "Username cannot be longer than 32 characters.")
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
      .max(64, "Email cannot be longer than 64 characters.")
      .regex(/[^<>"']/, "Email contains invalid characters."),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ .%^&*-]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, a number and a special character."
      )
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password cannot be longer than 255 characters.")
      .superRefine(async (password, ctx) => {
        if (await hasPwBeenPwned(password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "This password may have been leaked (source: https://haveibeenpwned.com/). Please choose a different one.",
            path: ["password"],
          });
        }
      }),
  })
  .superRefine(async ({ username, email }, ctx) => {
    if (!(await usernameIsAvailable(username))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This username is already taken.",
        path: ["username"],
      });
    }
    if (!(await emailIsAvailable(email))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This email is already connected to a user.",
        path: ["email"],
      });
    }
  });

export const selectUsersSchema = createSelectSchema(userTable).pick({
  username: true,
});
