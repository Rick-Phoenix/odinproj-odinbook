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
import { lowercase, trim } from "../utils/db-methods";

//

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
        "https://res.cloudinary.com/dqjizh49f/image/upload/v1733903271/Messaging%20App/genericpfp.jpg"
      ),
    oauthProvider: text("oauthProvider"),
    oauthId: integer("oauthId"),
    status: text("status"),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(lowercase(trim(table.email))),
    uniqueIndex("usernameUniqueIndex").on(lowercase(trim(table.username))),
  ]
);

export const userRelations = relations(users, ({ many }) => ({
  ownChats: many(chatInstances, { relationName: "chatOwner" }),
  chatsIn: many(chatInstances, { relationName: "chatContact" }),
  messages: many(messages),
  posts: many(posts, { relationName: "postAuthor" }),
  comments: many(comments),
  roomsCreated: many(rooms),
  roomSubscriptions: many(roomSubs),
  likes: many(likes),
  listingsCreated: many(listings),
  listingsSaved: many(savedListings),
  sessions: many(sessions),
}));

//

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
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    chatId: integer("chatId")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.chatId, t.ownerId],
    }),
    uniqueIndex("uniqueUserChat").on(t.ownerId, t.chatId, t.contactId),
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
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  author: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

//

const mktCategories = [
  "Technology",
  "Motors",
  "Clothing",
  "Books",
  "Collectibles",
  "Sport",
] as const;
export const categoryEnum = pgEnum("mktCategories", mktCategories);

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
  category: categoryEnum().notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow().notNull(),
});

export const listingsRelations = relations(listings, ({ many, one }) => ({
  pics: many(listingPics),
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
}));

export const savedListings = pgTable("savedListings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  listingId: integer("listingId")
    .notNull()
    .references(() => listings.id),
});

export const savedListingsRelations = relations(savedListings, ({ one }) => ({
  user: one(users, {
    fields: [savedListings.userId],
    references: [users.id],
  }),
}));

//

export const listingPics = pgTable("listingPics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  listingId: integer("listingId")
    .references(() => listings.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  isThumbnail: boolean("isThumbnail").notNull().default(false),
});

export const listingPicsRelations = relations(listingPics, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPics.listingId],
    references: [listings.id],
  }),
}));

//

const roomsCategories = [
  "animals",
  "technology",
  "design",
  "photography",
  "science",
  "history",
  "philosophy",
  "spirituality",
] as const;
export type roomsCategory = (typeof roomsCategories)[number];
export const roomsCategoriesEnum = pgEnum("roomCategories", roomsCategories);

export const rooms = pgTable(
  "rooms",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    creatorId: text("creatorId").references(() => users.id),
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
    index("roomNameIndex").on(t.name),
  ]
);

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  creator: one(users, {
    fields: [rooms.creatorId],
    references: [users.id],
    relationName: "roomCreator",
  }),
  subscribers: many(roomSubs),
  posts: many(posts),
}));

export const roomSubs = pgTable("roomSubscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  roomId: integer("roomId")
    .references(() => rooms.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("userId").references(() => users.id, {
    onDelete: "cascade",
  }),
});

export const roomSubscriptionsRelations = relations(roomSubs, ({ one }) => ({
  user: one(users, {
    fields: [roomSubs.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [roomSubs.roomId],
    references: [rooms.id],
  }),
}));

//

export const posts = pgTable(
  "posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    roomId: integer("roomId")
      .references(() => rooms.id, { onDelete: "cascade" })
      .notNull(),
    authorId: text("authorId")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    likesCount: integer("likesCount").notNull().default(0),
  },
  (t) => [
    index("likesCountIndex").on(t.likesCount),
    index("postsChronologicalIndex").on(t.createdAt),
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
    fields: [posts.roomId],
    references: [rooms.id],
  }),
  likes: many(likes),
}));

//

export const comments = pgTable(
  "comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("userId").references(() => users.id),
    postId: integer("postId")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("createdAt", { mode: "string" })
      .defaultNow()
      .notNull(),
    parentCommentId: integer("parentCommentId").references(
      (): AnyPgColumn => comments.id
    ),
  },
  (t) => [index("commentsChronologicalIndex").on(t.createdAt)]
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
  replies: many(commentReplies, { relationName: "parentComment" }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
}));

export const commentReplies = pgTable("commentReplies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  commentId: integer("commentId").references(() => comments.id),
  replyId: integer("replyId").references(() => comments.id),
});

export const commentRepliesRelations = relations(commentReplies, ({ one }) => ({
  comment: one(comments, {
    relationName: "parentComment",
    fields: [commentReplies.commentId],
    references: [comments.id],
  }),
  reply: one(comments, {
    relationName: "reply",
    fields: [commentReplies.replyId],
    references: [comments.id],
  }),
}));

//

export const likes = pgTable(
  "likes",
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

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

//
