import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { lowercase, trim } from "../utils/db-methods";

export const userTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 31 }).notNull(),
    email: varchar("email", { length: 63 }),
    hash: text("hash"),
    avatarUrl: text("avatarUrl"),
    oauthProvider: text("oauthProvider"),
    oauthId: integer("oauthId"),
  },
  (table) => [
    uniqueIndex("emailUniqueIndex").on(lowercase(trim(table.email))),
    uniqueIndex("usernameUniqueIndex").on(lowercase(trim(table.username))),
  ]
);

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
