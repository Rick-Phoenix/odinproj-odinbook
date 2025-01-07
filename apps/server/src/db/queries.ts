import { lowercase } from "../utils/db-methods";
import db from "./dbConfig";

export async function emailIsAvailable(email: string): Promise<boolean> {
  const result = await db.query.userTable.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.email, email),
  });

  return result === undefined;
}

export async function usernameIsAvailable(username: string): Promise<boolean> {
  const result = await db.query.userTable.findFirst({
    where: (existingUser, { eq }) =>
      eq(lowercase(existingUser.username), username.toLocaleLowerCase()),
  });

  return result === undefined;
}
