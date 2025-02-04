import { eq } from "drizzle-orm";
import { lowercase } from "../utils/db-methods";
import db from "./dbConfig";
import {
  chatInstances,
  chats,
  messages,
  rooms,
  roomSubs,
  type roomsCategory,
} from "./schema";

export async function fetchUserData(userId: string) {
  const userData = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      roomSubscriptions: { with: { room: { with: { posts: { limit: 20 } } } } },
    },
    columns: { avatarUrl: true, createdAt: true, status: true, username: true },
  });

  return userData;
}

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

export async function fetchUserProfile(username: string) {
  return await db.query.users.findFirst({
    where(user, { eq }) {
      return eq(lowercase(user.username), username.toLocaleLowerCase());
    },
    columns: { avatarUrl: true, username: true, createdAt: true, status: true },
    with: {
      comments: {
        with: {
          post: {
            columns: { title: true, id: true },
            with: { room: { columns: { name: true } } },
          },
        },
      },
      posts: {
        columns: { text: true, title: true, id: true, createdAt: true },
        with: { room: { columns: { name: true } } },
      },
      listingsCreated: { with: { pics: true } },
      roomSubscriptions: true,
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

  if (chats.length === 0) return chats;

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

export async function findOrCreateChat(
  userId: string,
  contactUsername: string
) {
  const contact = await findUserByUsername(contactUsername);
  if (!contact) return false;
  const { id: contactId } = contact;
  const chatInstance = await db.query.chatInstances.findFirst({
    where(chat, { eq, and }) {
      return and(eq(chat.ownerId, userId), eq(chat.contactId, contactId));
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: { with: { messages: true } },
    },
    columns: {},
  });

  if (chatInstance)
    return { contact: chatInstance.contact, ...chatInstance.chat };

  await db.transaction(async (tx) => {
    const existingChat = await tx.query.chatInstances.findFirst({
      where(inst, { eq, and }) {
        return and(eq(inst.contactId, userId), eq(inst.ownerId, contactId));
      },
      columns: { chatId: true },
    });
    let chatId = existingChat?.chatId;
    if (!chatId) {
      const [{ id }] = await tx
        .insert(chats)
        .values({})
        .returning({ id: chats.id });

      await tx
        .insert(chatInstances)
        .values({ chatId: id, ownerId: contactId, contactId: userId });

      chatId = id;
    }

    await tx
      .insert(chatInstances)
      .values({ chatId, ownerId: userId, contactId });
  });

  return findOrCreateChat(userId, contactUsername);
}

export async function getPost(postId: number) {
  return await db.query.posts.findFirst({
    where(post, { eq }) {
      return eq(post.id, postId);
    },
    with: { comments: true },
  });
}

export async function addSubscription(userId: string, roomId: number) {
  await db.insert(roomSubs).values({ userId, roomId }).onConflictDoNothing();
}

export async function fetchPosts(
  roomId: number,
  cursor: number,
  orderBy: "likes" | "time"
) {
  const posts = await db.query.posts.findMany({
    where: (post, { eq }) => eq(post.roomId, roomId),
    with: { author: { columns: { username: true } } },
    limit: 20,
    offset: cursor * 20,
    orderBy: (post, { desc }) =>
      orderBy === "likes" ? desc(post.likesCount) : desc(post.createdAt),
  });

  return posts;
}

export async function fetchRoom(name: string, orderBy: "time" | "likes") {
  const room = await db.query.rooms.findFirst({
    where: (room, { eq }) => eq(lowercase(room.name), name.toLocaleLowerCase()),
    with: {
      posts: {
        limit: 20,
        columns: {
          id: true,
          likesCount: true,
          title: true,
          text: true,
          createdAt: true,
        },
        with: { author: { columns: { avatarUrl: true, username: true } } },
        orderBy: (post, { desc }) =>
          orderBy === "likes" ? desc(post.likesCount) : desc(post.createdAt),
      },
    },
  });

  return room;
}

export async function insertRoom(
  userId: string,
  name: string,
  category: roomsCategory
) {
  const [room] = await db
    .insert(rooms)
    .values({ creatorId: userId, name, category })
    .onConflictDoNothing()
    .returning();
  return room as typeof room | undefined;
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
