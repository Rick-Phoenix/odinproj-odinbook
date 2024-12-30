import db from ".";
import { lowercase } from "./utils";

export async function isEmailAvailable(email: string): Promise<boolean> {
  const result = await db.query.user.findFirst({
    where: (users, { eq }) =>
      eq(lowercase(users.email), email.toLocaleLowerCase()),
  });

  return result === undefined;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const result = await db.query.user.findFirst({
    where: (user, { eq }) =>
      eq(lowercase(user.name), username.toLocaleLowerCase()),
  });

  return result === undefined;
}
