import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { lowercase, trim } from "../utils/db-methods";
import { sql, type InferSelectModel } from "drizzle-orm";

export const userTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 31 }).notNull(),
    email: varchar("email", { length: 63 }).notNull(),
    hash: text("hash").notNull(),
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
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type Session = InferSelectModel<typeof sessionTable>;
export type User = InferSelectModel<typeof userTable>;
