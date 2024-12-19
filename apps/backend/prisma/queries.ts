import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DatabaseError extends Error {
  constructor(message: string, errName: string) {
    super(`${errName}\n${message}`);
    this.name = "DatabaseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
}

async function queryDB<T>(queryCallback: () => Promise<T>): Promise<T | null> {
  try {
    const result = await queryCallback();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new DatabaseError(error.message, error.name);
    else throw new Error("Unknown Error");
  }
}

export async function findUserByEmail(email: string) {
  const query = async () => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  };

  return await queryDB(query);
}

export async function findUserById(id: number) {
  const query = async () => {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  };

  return await queryDB(query);
}

export async function findUserByUsername(username: string) {
  const query = async () => {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  };

  return await queryDB(query);
}

export async function isUsernameAvailable(username: string) {
  const result = (await findUserByUsername(username)) === null;

  return result;
}

export async function isEmailAvailable(email: string) {
  const result = (await findUserByEmail(email)) === null;

  return result;
}
