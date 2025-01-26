import { lowercase } from "../utils/db-methods";
import db from "./dbConfig";

export async function emailIsNotAvailable(email: string): Promise<boolean> {
  const result = await db.query.usersTable.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.email, email),
  });

  return result !== undefined;
}

export async function usernameIsNotAvailable(
  username: string
): Promise<boolean> {
  const result = await db.query.usersTable.findFirst({
    where: (existingUser, { eq }) =>
      eq(lowercase(existingUser.username), username.toLocaleLowerCase()),
  });

  return result !== undefined;
}

export async function findUserByUsername(username: string) {
  return await db.query.usersTable.findFirst({
    where(user, { eq }) {
      return eq(lowercase(user.username), username.toLocaleLowerCase());
    },
  });
}

export async function getUserChats(userId: string) {
  const chats = await db.query.chatInstancesTable.findMany({
    where(chat, { eq }) {
      return eq(chat.userId, userId);
    },
    with: { chat: { with: { messages: true } } },
    columns: {},
  });

  if (chats.length === 0) return null;

  return chats.map((item) => item.chat);
}

export async function getSingleChat(userId: string, chatId: number) {
  const chat = await db.query.chatInstancesTable.findFirst({
    where(chat, { eq, and }) {
      return and(eq(chat.userId, userId), eq(chat.chatId, chatId));
    },
    with: { chat: { with: { messages: true } } },
    columns: {},
  });

  return chat?.chat;
}

export async function getPost(postId: number) {
  return await db.query.postsTable.findFirst({
    where(post, { eq }) {
      return eq(post.id, postId);
    },
    with: { comments: true, likes: true },
  });
}

export async function findUserByEmail(email: string) {
  return await db.query.usersTable.findFirst({
    where(user, { eq }) {
      return eq(user.email, email.toLocaleLowerCase());
    },
  });
}

export async function findUserByOauthCredentials(provider: string, id: number) {
  return await db.query.usersTable.findFirst({
    where(user, { eq, and }) {
      return and(eq(user.oauthProvider, provider), eq(user.oauthId, id));
    },
  });
}
