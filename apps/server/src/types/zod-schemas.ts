import { z } from "@hono/zod-openapi";
import { usernameIsAvailable, emailIsAvailable } from "../db/queries";
import { userTable } from "../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { hasPwBeenPwned } from "../utils/encryption";

export const insertUserSchema = createInsertSchema(userTable)
  .pick({ username: true, email: true })
  .extend({
    name: z
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
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[#?!@$%^&*-.]/,
        "Password must contain at least one special character"
      )
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password cannot be longer than 255 characters.")
      .refine(async (password) => {
        return await hasPwBeenPwned(password);
      }, "This password is not secure. Please choose a different one."),
  })
  .refine(async ({ username }) => {
    return await usernameIsAvailable(username);
  }, "This username is already taken.")
  .refine(async ({ email }) => {
    return await emailIsAvailable(email);
  }, "This email is already connected to a user.");

export const selectUsersSchema = createSelectSchema(userTable).pick({
  username: true,
});
