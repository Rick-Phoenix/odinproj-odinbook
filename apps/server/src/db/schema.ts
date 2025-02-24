import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { lowercase, trim } from "./db-methods";

export const users = pgTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    username: varchar("username", { length: 31 }).notNull().unique(),
    email: varchar("email", { length: 63 }).unique(),
    hash: text("hash"),
    avatarUrl: text("avatarUrl")
      .notNull()
      .default(
        "https://res.cloudinary.com/dqjizh49f/image/upload/v1738602566/Nexus/foq8r5a5lczqphdexyy3.jpg"
      ),
    oauthProvider: text("oauthProvider"),
    oauthId: integer("oauthId"),
    status: text("status"),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(lowercase(trim(table.email))),
    uniqueIndex("usernameUniqueIndex").on(lowercase(trim(table.username))),
  ]
);

export const userRelations = relations(users, ({ many }) => ({
  ownChats: many(chatInstances, { relationName: "chatOwner" }),
  chatsIn: many(chatInstances, { relationName: "chatContact" }),
  messagesSent: many(messages, { relationName: "messageSender" }),
  messagesReceived: many(messages, { relationName: "messageReceiver" }),
  posts: many(posts, { relationName: "postAuthor" }),
  comments: many(comments),
  roomsCreated: many(rooms),
  roomSubscriptions: many(subs),
  likes: many(postLikes),
  listingsCreated: many(listings),
  listingsSaved: many(savedListings),
  sessions: many(sessions),
}));

export const chats = pgTable("chats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  instances: many(chatInstances),
  messages: many(messages),
}));

//

export const chatInstances = pgTable(
  "chatInstances",
  {
    ownerId: text("ownerId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    contactId: text("contactId")
      .references(() => users.id)
      .notNull(),
    chatId: integer("chatId")
      .references(() => chats.id)
      .notNull(),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
    firstMessageId: integer("firstMessageId").notNull().default(0),
    isDeleted: boolean("isDeleted").notNull().default(false),
    lastRead: timestamp("lastRead", { mode: "string", withTimezone: true, precision: 3 }),
  },
  (t) => [
    primaryKey({
      columns: [t.chatId, t.ownerId],
    }),
    uniqueIndex("uniqueChatIndex").on(t.ownerId, t.contactId),
  ]
);

export const chatInstancesRelations = relations(chatInstances, ({ one }) => ({
  owner: one(users, {
    fields: [chatInstances.ownerId],
    references: [users.id],
    relationName: "chatOwner",
  }),
  contact: one(users, {
    fields: [chatInstances.contactId],
    references: [users.id],
    relationName: "chatContact",
  }),
  chat: one(chats, {
    fields: [chatInstances.chatId],
    references: [chats.id],
  }),
}));

//

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

//

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  chatId: integer("chatId")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  senderId: text("senderId").references(() => users.id),
  receiverId: text("receiverId").references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "messageSender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "messageReceiver",
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

//

export const marketplaceCategories = [
  "Technology",
  "Motors",
  "Clothing",
  "Books",
  "Collectibles",
  "Sport",
] as const;
export type MarketplaceCategory = (typeof marketplaceCategories)[number];
export const categoryEnum = pgEnum("mktCategories", marketplaceCategories);

export const itemConditions = ["New", "Used", "As new", "Spare parts only"] as const;
export const itemConditionsEnum = pgEnum("itemConditions", itemConditions);

export const listings = pgTable("listings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sellerId: text("sellerId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  sold: boolean("sold").notNull().default(false),
  condition: itemConditionsEnum().notNull(),
  category: categoryEnum().notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
  picUrl: text("picUrl")
    .notNull()
    .default(
      "https://res.cloudinary.com/dqjizh49f/image/upload/v1738602566/Nexus/foq8r5a5lczqphdexyy3.jpg"
    ),
});

export const listingsRelations = relations(listings, ({ many, one }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
  saved: many(savedListings),
}));

export const savedListings = pgTable(
  "savedListings",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    listingId: integer("listingId")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "string", withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex("uniqueUserSavedListingIndex").on(t.listingId, t.userId)]
);

export const savedListingsRelations = relations(savedListings, ({ one }) => ({
  user: one(users, {
    fields: [savedListings.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [savedListings.listingId],
    references: [listings.id],
  }),
}));

//

export const roomCategoriesArray = [
  "Pets",
  "Computers",
  "Gaming",
  "Books",
  "Movies",
  "Music",
  "Fitness",
  "Food",
  "Travel",
  "Art",
] as const;
export type RoomCategories = (typeof roomCategoriesArray)[number];
export const roomsCategoriesEnum = pgEnum("roomCategories", roomCategoriesArray);

export const rooms = pgTable(
  "rooms",
  {
    name: text("name").primaryKey(),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
    creatorId: text("creatorId").references(() => users.id, {
      onDelete: "cascade",
    }),
    category: roomsCategoriesEnum().notNull(),
    avatar: text("avatar")
      .notNull()
      .default(
        "https://res.cloudinary.com/dqjizh49f/image/upload/v1738602566/Nexus/foq8r5a5lczqphdexyy3.jpg"
      ),
    description: text("description"),
    subsCount: integer("subsCount").notNull().default(0),
  },
  (t) => [
    uniqueIndex("uniqueRoomIndex").on(lowercase(trim(t.name))),
    index("subsCountIndex").on(t.subsCount),
  ]
);

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  creator: one(users, {
    fields: [rooms.creatorId],
    references: [users.id],
    relationName: "roomCreator",
  }),
  subscribers: many(subs),
  posts: many(posts),
}));

export const subs = pgTable("subs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  room: text("room")
    .notNull()
    .references(() => rooms.name, { onDelete: "cascade" }),

  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export const Relations = relations(subs, ({ one }) => ({
  user: one(users, {
    fields: [subs.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [subs.room],
    references: [rooms.name],
  }),
}));

//

export const posts = pgTable(
  "posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    room: text("room")
      .notNull()
      .references(() => rooms.name, { onDelete: "cascade" }),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
    likesCount: integer("likesCount").notNull().default(0),
  },
  (t) => [
    index("likesCountIndex").on(t.likesCount),
    index("postsChronologicalIndex").on(t.createdAt),
    index("postsAuthorsIndex").on(t.authorId),
    index("postsRoomIndex").on(t.room),
  ]
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "postAuthor",
  }),
  comments: many(comments),
  room: one(rooms, {
    fields: [posts.room],
    references: [rooms.name],
  }),
  likes: many(postLikes),
}));

//

export const comments = pgTable(
  "comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: integer("postId")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
    parentCommentId: integer("parentCommentId").references((): AnyPgColumn => comments.id),
    likesCount: integer("likesCount").notNull().default(0),
    isDeleted: boolean("isDeleted").notNull().default(false),
  },
  (t) => [
    index("commentsChronologicalIndex").on(t.createdAt),
    index("commentsPostIndex").on(t.postId),
    index("commentsAuthorIndex").on(t.userId),
  ]
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
}));

export const commentLikes = pgTable(
  "commentLikes",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    commentId: integer("commentId")
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [uniqueIndex("uniqueUserCommentLike").on(table.userId, table.commentId)]
);

//

export const postLikes = pgTable(
  "postLikes",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    postId: integer("postId")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [uniqueIndex("uniqueUserPostLike").on(table.userId, table.postId)]
);

export const likesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
}));

//
