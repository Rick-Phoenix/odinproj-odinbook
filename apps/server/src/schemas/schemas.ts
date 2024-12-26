import { isEmailAvailable, isUsernameAvailable } from "prisma/queries.js";
import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "Username cannot be longer than 20 characters.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain alphanumeric characters, dashes and underscores."
    )
    .refine(async (username) => {
      return await isUsernameAvailable(username);
    }, "This username is already taken."),
  email: z
    .string()
    .trim()
    .email()
    .max(100, "Email cannot be longer than 100 characters.")
    .regex(/[^<>"']/, "Email contains invalid characters.")
    .refine(async (email) => {
      return await isEmailAvailable(email);
    }, "This email is already connected to a user."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot be longer than 50 characters.")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/,
      "Password must contain at least one number, one uppercase letter and a special character."
    ),
});
