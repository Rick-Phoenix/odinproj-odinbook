import { eq } from "drizzle-orm";
import { lowercase } from "../utils/db-methods";
import db from "./dbConfig";
import { chatInstances, chats, messages } from "./schema";

export async function emailIsNotAvailable(email: string): Promise<boolean> {
  const result = await db.query.users.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.email, email),
  });

  return result !== undefined;
}

export async function usernameIsNotAvailable(
  username: string
): Promise<boolean> {
  const result = await db.query.users.findFirst({
    where: (existingUser, { eq }) =>
      eq(lowercase(existingUser.username), username.toLocaleLowerCase()),
  });

  return result !== undefined;
}

export async function findUserByUsername(username: string) {
  return await db.query.users.findFirst({
    where(user, { eq }) {
      return eq(lowercase(user.username), username.toLocaleLowerCase());
    },
  });
}

export async function getUserChats(userId: string) {
  const chats = await db.query.chatInstances.findMany({
    where(chat, { eq }) {
      return eq(chat.ownerId, userId);
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: { with: { messages: true } },
    },
    columns: {},
  });

  if (chats.length === 0) return null;

  return chats.map((item) => ({ contact: item.contact, ...item.chat }));
}

export async function getUserChatIds(userId: string) {
  const chatIds = await db
    .select({ id: chats.id })
    .from(chatInstances)
    .innerJoin(chats, eq(chatInstances.chatId, chats.id))
    .where(eq(chatInstances.ownerId, userId));
  return chatIds.map((obj) => obj.id);
}

export async function getSingleChat(userId: string, chatId: number) {
  const chat = await db.query.chatInstances.findFirst({
    where(chat, { eq, and }) {
      return and(eq(chat.ownerId, userId), eq(chat.chatId, chatId));
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: { with: { messages: true } },
    },
    columns: {},
  });

  if (chat) return { contact: chat.contact, ...chat.chat };

  return chat;
}

export async function getPost(postId: number) {
  return await db.query.posts.findFirst({
    where(post, { eq }) {
      return eq(post.id, postId);
    },
    with: { comments: true, likes: true },
  });
}

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where(user, { eq }) {
      return eq(user.email, email.toLocaleLowerCase());
    },
  });
}

export async function findUserByOauthCredentials(provider: string, id: number) {
  return await db.query.users.findFirst({
    where(user, { eq, and }) {
      return and(eq(user.oauthProvider, provider), eq(user.oauthId, id));
    },
  });
}

export async function registerMessage(
  chatId: number,
  userId: string,
  text: string
) {
  const validChat = await db.query.chatInstances.findFirst({
    where(chatIns, { and, eq }) {
      return and(eq(chatIns.chatId, chatId), eq(chatIns.ownerId, userId));
    },
  });

  if (!validChat) return false;

  const [message] = await db
    .insert(messages)
    .values({ text, userId, chatId })
    .returning();

  return message;
}
