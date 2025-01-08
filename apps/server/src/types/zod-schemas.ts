import { createSelectSchema } from "drizzle-zod";
import { userTable } from "../db/schema";

export const selectUsersSchema = createSelectSchema(userTable).pick({
  username: true,
});
