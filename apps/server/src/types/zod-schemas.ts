import { createSelectSchema } from "drizzle-zod";
import { userTable } from "../db/schema";
export { loginValidationSchema } from "../routes/auth/login";
export { insertUserSchema as signupValidationSchema } from "../routes/auth/signup";

export const selectUserSchema = createSelectSchema(userTable);
