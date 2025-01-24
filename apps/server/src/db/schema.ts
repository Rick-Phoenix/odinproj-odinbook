import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { lowercase, trim } from "../utils/db-methods";

export const usersTable = pgTable(
  "users",
  {
    id: text("id").notNull().primaryKey(),
    username: varchar("username", { length: 31 }).notNull(),
    email: varchar("email", { length: 63 }),
    hash: text("hash"),
    avatarUrl: text("avatarUrl"),
    oauthProvider: text("oauthProvider"),
    oauthId: integer("oauthId"),
    status: text("status"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(lowercase(trim(table.email))),
    uniqueIndex("usernameUniqueIndex").on(lowercase(trim(table.username))),
  ]
);

export const userRelations = relations(usersTable, ({ many }) => ({
  chats: many(chatInstancesTable),
  messages: many(messagesTable),
}));

export const chatsTable = pgTable("chats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const chatsRelations = relations(chatsTable, ({ many }) => ({
  instances: many(chatInstancesTable),
  messages: many(messagesTable),
}));

export const chatInstancesTable = pgTable(
  "chatInstances",
  {
    userId: text("userId")
      .references(() => usersTable.id)
      .notNull(),
    chatId: integer("chatId")
      .references(() => chatsTable.id)
      .notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.chatId, t.userId],
    }),
  ]
);

export const chatInstancesRelations = relations(
  chatInstancesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [chatInstancesTable.userId],
      references: [usersTable.id],
    }),
    chat: one(chatsTable, {
      fields: [chatInstancesTable.chatId],
      references: [chatsTable.id],
    }),
  })
);

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const messagesTable = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  chatId: integer("chatId").references(() => chatsTable.id),
  userId: text("userId").references(() => usersTable.id, {}),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [messagesTable.userId],
    references: [usersTable.id],
  }),
  chat: one(chatsTable, {
    fields: [messagesTable.chatId],
    references: [chatsTable.id],
  }),
}));

export const listingsTable = pgTable("listings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("userId").references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
});

export const listingPicsTable = pgTable("listingPics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  listingId: integer("listingId").references(() => listingsTable.id),
  url: text("url"),
  isThumbnail: boolean("isThumbnail"),
});
