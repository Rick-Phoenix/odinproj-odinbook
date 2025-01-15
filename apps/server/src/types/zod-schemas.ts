import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessionTable, userTable } from "../db/schema";
import { z } from "@hono/zod-openapi";

// Database Schemas
export const userSchema = createSelectSchema(userTable);
export const sessionSchema = createSelectSchema(sessionTable);

// Input Validation Schemas

export const signupValidationSchema = createInsertSchema(userTable)
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
      .regex(/[^<>"']/, "Email contains invalid characters.")
      .regex(/^.+@.+\..+$/, "Invalid email format."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ .%^&*-]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, a number and a special character."
      )
      .max(255, "Password cannot be longer than 255 characters."),
  });

export const loginValidationSchema = signupValidationSchema.pick({
  username: true,
  password: true,
});
