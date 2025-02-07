import { and, desc, eq, sql } from "drizzle-orm";
import type { BasicPost } from "../types/zod-schemas";
import { isLiked, isSubscribed, lowercase } from "./db-methods";
import db from "./dbConfig";
import {
  chatInstances,
  chats,
  likes,
  messages,
  posts,
  rooms,
  subs,
  users,
  type roomsCategory,
} from "./schema";
import { initialFeedQuery, totalPostsFromUserSubs } from "./subqueries";

export async function fetchUserData(userId: string) {
  const totalPostsFromSubs = totalPostsFromUserSubs(userId);
  const userData = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    extras: {
      totalFeedPosts: sql<number>`${db.$count(totalPostsFromSubs)}::int`
        .mapWith(Number)
        .as("totalFeedPosts"),
      ...initialFeedQuery(userId),
    },
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

export async function fetchPost(userId: string, postId: number) {
  const post = await db.query.posts.findFirst({
    where(post, { eq }) {
      return eq(post.id, postId);
    },
    with: {
      comments: true,
      room: { columns: { name: true } },
      author: { columns: { username: true } },
    },
    extras: (f) => isLiked(userId, f.id),
  });

  if (post) return { ...post, author: post.author.username };

  return post;
}

export async function addSubscription(userId: string, room: string) {
  await db.insert(subs).values({ userId, room }).onConflictDoNothing();
}

export async function removeSubscription(userId: string, room: string) {
  await db
    .delete(subs)
    .where(and(eq(subs.room, room), eq(subs.userId, userId)));
}

export async function fetchFeed(
  userId: string,
  cursor: number,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) {
  const userSubs = db
    .$with("user_feed")
    .as(
      db
        .select({ room: rooms.name })
        .from(subs)
        .innerJoin(rooms, eq(rooms.name, subs.room))
        .where(eq(subs.userId, userId))
    );

  const userFeed = await db
    .with(userSubs)
    .select({
      post: posts,
      author: users.username,
      ...isLiked(userId, posts.id),
    })
    .from(userSubs)
    .innerJoin(posts, eq(posts.room, userSubs.room))
    .innerJoin(users, eq(users.id, posts.authorId))

    .orderBy(
      orderBy === "likesCount" ? desc(posts.likesCount) : desc(posts.createdAt)
    )
    .limit(20)
    .offset(cursor * 20);

  const parsedFeed = userFeed.map((i) => ({
    ...i.post,
    isLiked: i.isLiked,
    author: i.author,
  }));

  return parsedFeed;
}

export const fetchPosts = async (
  userId: string,
  room: string,
  orderBy: "likesCount" | "createdAt" = "likesCount",
  cursor: number = 0
) => {
  const orderByColumns = {
    createdAt: sql.raw(`"createdAt"`),
    likesCount: sql.raw(`"likesCount"`),
  } as const;

  const safeOrderBy = orderByColumns[orderBy] ?? orderByColumns.likesCount;
  const { rows: posts } = await db.execute<BasicPost>(
    sql`SELECT
  *,
  (
    SELECT DISTINCT
      username
    FROM
      users
    WHERE
      users.id = posts."authorId"
  ) AS author, EXISTS (
            SELECT 1
            FROM likes
            WHERE likes."postId" = posts.id
            AND likes."userId" = ${userId}
          ) AS isLiked
FROM
  posts
WHERE
  posts.room = ${room} ORDER BY posts."${safeOrderBy}" DESC
LIMIT 20 OFFSET ${cursor * 20}::int`
  );

  return posts;
};

export async function fetchRoom(
  userId: string,
  roomName: string,
  orderBy: "likesCount" | "createdAt" = "likesCount"
) {
  const room = await db.query.rooms.findFirst({
    where: (room, { eq }) =>
      eq(lowercase(room.name), roomName.toLocaleLowerCase()),
    with: {
      posts: {
        limit: 20,
        with: { author: { columns: { username: true } } },
        orderBy: (post, { desc }) =>
          orderBy === "likesCount"
            ? desc(post.likesCount)
            : desc(post.createdAt),
        extras: (f) => isLiked(userId, f.id),
      },
    },
    extras: (f) => ({ ...isSubscribed(userId, f.name) }),
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

export async function insertLike(userId: string, postId: number) {
  return await db.insert(likes).values({ userId, postId });
}

export async function removeLike(userId: string, postId: number) {
  return await db
    .delete(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
}
