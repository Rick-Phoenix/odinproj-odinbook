import db from "./dbConfig";

export async function emailIsAvailable(email: string): Promise<boolean> {
  const result = await db.query.userTable.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.email, email),
  });

  return result === undefined;
}

export async function usernameIsAvailable(username: string): Promise<boolean> {
  const result = await db.query.userTable.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.username, username),
  });

  return result === undefined;
}
