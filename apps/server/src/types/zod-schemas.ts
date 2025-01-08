import { createSelectSchema } from "drizzle-zod";
import { userTable } from "../db/schema";

export const selectUserSchema = createSelectSchema(userTable);
