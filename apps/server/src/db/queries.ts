import { and, asc, desc, eq, getTableColumns, lt, lte, sql } from "drizzle-orm";
import type { BasicPost, ListingInputs } from "../types/zod-schemas";
import { lowercase, withCTEColumns } from "./db-methods";
import db from "./dbConfig";
import {
  chatInstances,
  chats,
  commentLikes,
  comments,
  listings,
  messages,
  postLikes,
  posts,
  rooms,
  savedListings,
  subs,
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
  totalPostsFromRoom,
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
      },
      listingsSaved: {
        with: {
          listing: { extras: { isSaved: sql<boolean>`true`.as("isSaved") } },
        },
      },
    },
    extras: (f) => ({
      totalFeedPosts: sql<number>`${db.$count(totalPostsFromSubs)}::int`
        .mapWith(Number)
        .as("totalFeedPosts"),
      ...initialFeedQuery(userId),
      ...userStats(userId),
      favoriteListingsCategory: sql<string>`(
    SELECT lis.category
    FROM "savedListings" s
    JOIN listings lis ON s."listingId" = lis.id
    WHERE s."userId" = ${userId}
    GROUP BY lis.category
    ORDER BY COUNT(*) DESC
    LIMIT 1
  )`.as("favorite_listings_category"),
    }),
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

export async function fetchUserProfile(userId: string, username: string) {
  const profile = await db.query.users.findFirst({
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
      listingsCreated: {
        extras: (f) => ({
          ...isSaved(userId, f.id),
          seller: sql<string>`${username}::text`.as("seller"),
        }),
      },
      roomSubscriptions: true,
    },
  });

  return profile;
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

export async function insertPost(
  authorId: string,
  authorUsername: string,
  room: string,
  title: string,
  text: string
) {
  const [post] = await db
    .insert(posts)
    .values({ authorId, room, title, text })
    .returning({
      ...getTableColumns(posts),
    });

  if (post) return { ...post, isLiked: true, author: authorUsername };

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
  cursorLikes: number,
  cursorTime: string,
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
      ...postIsLiked(userId, posts.id),
    })
    .from(userSubs)
    .innerJoin(posts, eq(posts.room, userSubs.room))
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(
      orderBy === "likesCount"
        ? and(
            lte(posts.likesCount, cursorLikes),
            lt(posts.createdAt, cursorTime)
          )
        : lt(posts.createdAt, cursorTime)
    )
    .orderBy(
      ...(orderBy === "likesCount"
        ? [desc(posts.likesCount), desc(posts.createdAt)]
        : [desc(posts.createdAt), desc(posts.likesCount)])
    )
    .limit(20);

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
  cursorLikes: number,
  cursorTime: string
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
  posts.room = ${room} AND posts.${
    orderBy === "likesCount"
      ? sql.raw(
          `"likesCount" <= ${cursorLikes} AND posts."createdAt" < '${cursorTime}'`
        )
      : sql.raw(`"createdAt" < '${cursorTime}'`)
  } 
    ORDER BY posts.${safeOrderBy} DESC, ${
      orderBy === "likesCount"
        ? sql.raw(`"createdAt" DESC`)
        : sql.raw(`"likesCount" DESC`)
    }
LIMIT 20`
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
            ? [desc(post.likesCount), desc(post.createdAt)]
            : [desc(post.createdAt), desc(post.likesCount)],
        extras: (f) => postIsLiked(userId, f.id),
      },
    },
    extras: (f) => ({
      ...isSubscribed(userId, f.name),
      totalPosts: sql<number>`${db.$count(totalPostsFromRoom(roomName))}::int`
        .mapWith(Number)
        .as("totalPosts"),
    }),
  });

  if (room)
    return {
      ...room,
      posts: room.posts.map((post) => ({
        ...post,
        author: post.author.username,
      })),
    };

  return room;
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

export async function insertPostLike(userId: string, postId: number) {
  return await db.insert(postLikes).values({ userId, postId });
}

export async function removePostLike(userId: string, postId: number) {
  return await db
    .delete(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));
}

export async function insertCommentLike(userId: string, commentId: number) {
  return await db.insert(commentLikes).values({ userId, commentId });
}

export async function removeCommentLike(userId: string, commentId: number) {
  return await db
    .delete(commentLikes)
    .where(
      and(
        eq(commentLikes.userId, userId),
        eq(commentLikes.commentId, commentId)
      )
    );
}

export async function insertListing(
  inputs: { sellerId: string } & ListingInputs
) {
  const insertQuery = db
    .$with("inserted_listing")
    .as(db.insert(listings).values(inputs).returning());
  const [listing] = await db
    .with(insertQuery)
    .select({
      ...withCTEColumns(listings, insertQuery),
      seller: users.username,
      isSaved: sql<boolean>`${false}`,
    })
    .from(insertQuery)
    .innerJoin(users, eq(users.id, insertQuery.sellerId));
  return listing;
}

export async function fetchListing(userId: string, id: number) {
  const [listing] = await db
    .select({
      ...getTableColumns(listings),
      seller: users.username,
      ...isSaved(userId, listings.id),
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(eq(listings.id, id));

  return listing;
}

export async function fetchListingsByCategory(
  userId: string,
  category: MarketplaceCategory,
  orderBy: "cheapest" | "mostRecent"
) {
  const listingsByCategory = await db
    .select({
      ...getTableColumns(listings),
      seller: users.username,
      ...isSaved(userId, listings.id),
    })
    .from(listings)
    .innerJoin(users, eq(listings.sellerId, users.id))
    .where(and(eq(listings.sold, false), eq(listings.category, category)))
    .orderBy(
      orderBy === "cheapest" ? asc(listings.price) : desc(listings.createdAt)
    );
  return listingsByCategory;
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
      .where(eq(listings.sold, false))
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
      .where(and(eq(listings.sold, false), eq(listings.category, category)))
      .limit(10);
  }
  return suggestedListings;
}

export async function insertSavedListing(userId: string, listingId: number) {
  await db.insert(savedListings).values({ userId, listingId });
}

export async function deleteSavedListing(userId: string, listingId: number) {
  await db
    .delete(savedListings)
    .where(
      and(
        eq(savedListings.userId, userId),
        eq(savedListings.listingId, listingId)
      )
    );
}

export async function removeListing(userId: string, listingId: number) {
  await db
    .delete(listings)
    .where(and(eq(listings.sellerId, userId), eq(listings.id, listingId)));
}

export async function updateListing(userId: string, listingId: number) {
  await db
    .update(listings)
    .set({ sold: true })
    .where(and(eq(listings.sellerId, userId), eq(listings.id, listingId)));
}

export async function insertComment(
  userId: string,
  postId: number,
  text: string,
  parentCommentId?: number
) {
  const [comment] = await db
    .insert(comments)
    .values({ userId, postId, text, parentCommentId })
    .returning();
  return { ...comment, isLiked: true };
}
