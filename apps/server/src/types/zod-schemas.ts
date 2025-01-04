import { z } from "@hono/zod-openapi";
import { isUsernameAvailable, isEmailAvailable } from "../db/queries";
import { user } from "../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const sessionSchema = z
  .object({
    _data: z.any(),
    _expire: z.string().nullable(),
    _delete: z.boolean(),
    _accessed: z.string().nullable(),
  })
  .openapi({ required: ["_data", "_expire", "_delete", "_accessed"] });

export const insertUserSchema = createInsertSchema(user)
  .pick({ name: true, email: true })
  .extend({
    name: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long.")
      .max(32, "Username cannot be longer than 32 characters.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain alphanumeric characters, dashes and underscores."
      )
      .refine((username) => {
        return isUsernameAvailable(username);
      }, "This username is already taken."),
    email: z
      .string()
      .trim()
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long.")
      .max(64, "Email cannot be longer than 64 characters.")
      .regex(/[^<>"']/, "Email contains invalid characters.")
      .refine((email) => {
        return isEmailAvailable(email);
      }, "This email is already connected to a user."),
    // password: z
    //   .string()
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number")
    //   .regex(
    //     /[#?!@$%^&*-.]/,
    //     "Password must contain at least one special character"
    //   )
    //   .min(8, "Password must be at least 8 characters long")
    //   .max(64, "Password cannot be longer than 64 characters."),
  })
  .required();

export const selectUsersSchema = createSelectSchema(user).pick({ name: true });
