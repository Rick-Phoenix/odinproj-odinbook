import { hashPassword } from "@/lib/auth";
import { and, asc, desc, eq, getTableColumns, gte, ne, sql } from "drizzle-orm";
import db from "./db-config";
import { lowercase } from "./db-methods";
import {
  listings,
  postLikes,
  rooms,
  sessions,
  users,
  type MarketplaceCategory,
  type RoomCategories,
} from "./schema";
import {
  commentIsLiked,
  initialFeedQuery,
  isSaved,
  isSubscribed,
  postIsLiked,
  totalPostsFromUserSubs,
  userStats,
} from "./subqueries";

export async function fetchUserData(userId: string) {
  const totalPostsFromSubs = totalPostsFromUserSubs(userId);
  const userData = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      listingsCreated: {
        where: (f, { eq }) => eq(f.sold, false),
        orderBy: (f) => desc(f.createdAt),
      },
      listingsSaved: {
        with: {
          listing: { extras: { isSaved: sql<boolean>`true`.as("isSaved") } },
        },
        orderBy: (f) => desc(f.createdAt),
      },
      ownChats: {
        where: (f) => eq(f.isDeleted, false),
        with: {
          contact: { columns: { username: true, avatarUrl: true, id: true } },
          chat: {
            with: {
              messages: {
                where: (f) =>
                  gte(
                    f.id,
                    sql<number>`
                      (
                        SELECT
                          "firstMessageId"
                        FROM
                          "chatInstances"
                        WHERE
                          "chatInstances"."chatId" = ${f.chatId}
                          AND "chatInstances"."ownerId" = ${userId}
                      )
                    `
                  ),
                orderBy: (f) => asc(f.createdAt),
              },
            },
          },
        },
        columns: { lastRead: true },
      },
    },
    extras: (f) => ({
      totalFeedPosts: sql<number>`${db.$count(totalPostsFromSubs)}::int`
        .mapWith(Number)
        .as("totalFeedPosts"),
      ...initialFeedQuery(userId),
      ...userStats(userId),
      favoriteListingsCategory: sql<string>`
        (
          SELECT
            lis.category
          FROM
            "savedListings" s
            JOIN listings lis ON s."listingId" = lis.id
          WHERE
            s."userId" = ${userId}
          GROUP BY
            lis.category
          ORDER BY
            COUNT(*) DESC
          LIMIT
            1
        )
      `.as("favorite_listings_category"),
    }),
  });

  if (userData)
    return {
      ...userData,
      ownChats: userData.ownChats.map((chat) => ({
        contact: chat.contact,
        ...chat.chat,
        lastRead: chat.lastRead,
      })),
    };

  return userData;
}

export async function emailIsNotAvailable(email: string): Promise<boolean> {
  const result = await db.query.users.findFirst({
    where: (existingUser, { eq }) => eq(existingUser.email, email),
  });

  return result !== undefined;
}

export async function usernameIsNotAvailable(username: string): Promise<boolean> {
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

export async function fetchUserProfile(userId: string, username: string) {
  const profile = await db.query.users.findFirst({
    where(user, { eq }) {
      return and(
        eq(lowercase(user.username), username.toLocaleLowerCase()),
        ne(user.id, "deleted")
      );
    },
    columns: {
      avatarUrl: true,
      username: true,
      createdAt: true,
      status: true,
      id: true,
    },
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
      listingsCreated: {
        extras: (f) => ({
          ...isSaved(userId, f.id),
          seller: sql<string>`${username}::text`.as("seller"),
        }),
        orderBy: (f) => desc(f.createdAt),
      },
      roomSubscriptions: true,
    },
  });

  return profile;
}

export async function getUserChats(userId: string) {
  const chats = await db.query.chatInstances.findMany({
    where(chat, { eq, and }) {
      return and(eq(chat.isDeleted, false), eq(chat.ownerId, userId));
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: {
        with: {
          messages: {
            where: (f) =>
              gte(
                f.id,
                sql<number>`
                  (
                    SELECT
                      "firstMessageId"
                    FROM
                      "chatInstances"
                    WHERE
                      "chatInstances"."chatId" = ${f.chatId}
                      AND "chatInstances"."ownerId" = ${userId}
                  )
                `
              ),
            orderBy: (f) => asc(f.createdAt),
          },
        },
      },
    },
    columns: { lastRead: true },
    orderBy: (f) => desc(f.createdAt),
  });

  return chats.map((item) => ({ contact: item.contact, ...item.chat, lastRead: item.lastRead }));
}

export async function getSingleChat(userId: string, chatId: number) {
  const chat = await db.query.chatInstances.findFirst({
    where(chat, { eq, and }) {
      return and(eq(chat.ownerId, userId), eq(chat.chatId, chatId), eq(chat.isDeleted, false));
    },
    with: {
      contact: { columns: { username: true, avatarUrl: true, id: true } },
      chat: {
        with: {
          messages: {
            where: (f) =>
              gte(
                f.id,
                sql<number>`
                  (
                    SELECT
                      "firstMessageId"
                    FROM
                      "chatInstances"
                    WHERE
                      "chatInstances"."chatId" = ${f.chatId}
                      AND "chatInstances"."ownerId" = ${userId}
                  )
                `
              ),
            orderBy: (f) => asc(f.createdAt),
          },
        },
      },
    },
    columns: { lastRead: true },
  });

  if (chat) return { contact: chat.contact, ...chat.chat, lastRead: chat.lastRead };

  return chat;
}

export async function fetchPost(userId: string, postId: number) {
  const post = await db.query.posts.findFirst({
    where(post, { eq }) {
      return eq(post.id, postId);
    },
    with: {
      comments: {
        with: { author: { columns: { avatarUrl: true, username: true } } },
        extras: (f) => commentIsLiked(userId, f.id),
      },
      room: { extras: (f) => ({ ...isSubscribed(userId, f.name) }) },
      author: { columns: { username: true } },
    },
    extras: (f) => postIsLiked(userId, f.id),
  });

  if (post) return { ...post, author: post.author.username };

  return post;
}

export async function insertRoom(
  userId: string,
  name: string,
  category: RoomCategories,
  avatar?: string
) {
  const [room] = await db
    .insert(rooms)
    .values({ creatorId: userId, name, category, avatar })
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

export async function removePostLike(userId: string, postId: number) {
  return await db
    .delete(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
}

export async function fetchSuggestedListings(
  userId: string,
  category: MarketplaceCategory | undefined
) {
  let suggestedListings;
  if (!category) {
    suggestedListings = await db
      .select({
        ...getTableColumns(listings),
        seller: users.username,
        ...isSaved(userId, listings.id),
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(and(ne(listings.sellerId, userId), eq(listings.sold, false)))
      .orderBy(desc(listings.createdAt))
      .limit(10);
  } else {
    suggestedListings = await db
      .select({
        ...getTableColumns(listings),
        seller: users.username,
        ...isSaved(userId, listings.id),
      })
      .from(listings)
      .innerJoin(users, eq(listings.sellerId, users.id))
      .where(
        and(
          eq(listings.sold, false),
          eq(listings.category, category),
          ne(listings.sellerId, userId)
        )
      )
      .orderBy(desc(listings.createdAt))
      .limit(10);
  }
  return suggestedListings;
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  const [avatar] = await db
    .update(users)
    .set({ avatarUrl })
    .where(eq(users.id, userId))
    .returning({ newAvatarUrl: users.avatarUrl });
  return avatar;
}

export async function updateUserStatus(userId: string, status: string) {
  const [newStatus] = await db
    .update(users)
    .set({ status })
    .where(eq(users.id, userId))
    .returning({ newStatus: users.status });
  return newStatus;
}

export async function updateUserPassword(userId: string, sessionId: string, password: string) {
  const hash = await hashPassword(password);
  const [{ newHash }] = await db
    .update(users)
    .set({ hash })
    .where(eq(users.id, userId))
    .returning({ newHash: users.hash });
  if (!newHash) return false;
  await db.delete(sessions).where(and(eq(sessions.userId, userId), ne(sessions.id, sessionId)));
  return true;
}
