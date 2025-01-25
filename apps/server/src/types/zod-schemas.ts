import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  chatsTable,
  commentsTable,
  likesTable,
  listingPicsTable,
  listingsTable,
  messagesTable,
  postsTable,
  roomsTable,
  roomSubscriptionsTable,
  sessionsTable,
  usersTable,
} from "../db/schema";

// Database Schemas
export const userSchema = createSelectSchema(usersTable);
export const sessionSchema = createSelectSchema(sessionsTable);
export const messagesSchema = createSelectSchema(messagesTable);
export const chatSchema = createSelectSchema(chatsTable).extend({
  messages: z.array(messagesSchema),
});
export const commentSchema = createSelectSchema(commentsTable);
export const likesSchema = createSelectSchema(likesTable);
export const postSchema = createSelectSchema(postsTable).extend({
  comments: z.array(commentSchema),
  likes: z.array(likesSchema),
});
export const roomSchema = createSelectSchema(roomsTable).extend({
  posts: z.array(postSchema),
});
export const listingPicsSchema = createSelectSchema(listingPicsTable);
export const listingSchema = createSelectSchema(listingsTable).extend({
  pics: z.array(listingPicsSchema),
});

// Input Validation Schemas

export const insertUserSchema = createInsertSchema(usersTable)
  .pick({ username: true, email: true })
  .extend({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long.")
      .max(31, "Username cannot be longer than 31 characters.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain alphanumeric characters, dashes and underscores."
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long.")
      .max(63, "Email cannot be longer than 63 characters.")
      .regex(/[^<>"']/, "Email contains invalid characters.")
      .regex(/^.+@.+\..+$/, "Invalid email format."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ .%^&*-]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, a number and a special character."
      )
      .max(255, "Password cannot be longer than 255 characters."),
  });

export const loginValidationSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export const insertRoomSchema = createInsertSchema(roomsTable)
  .pick({ category: true, name: true })
  .extend({
    name: z.string().max(20, "The name cannot be longer than 20 characters."),
  });

export const insertPostSchema = createInsertSchema(postsTable)
  .omit({ createdAt: true, id: true, userId: true })
  .extend({
    title: z
      .string()
      .min(20, "The post's title must be at least 20 characters long.")
      .max(100, "The title cannot be longer than 100 characters."),
    text: z
      .string()
      .min(20, "The post's content must be at least 20 characters long.")
      .max(200, "The post's content cannot be longer than 200 characters."),
  });

export const insertCommentSchema = createInsertSchema(commentsTable)
  .omit({ createdAt: true, id: true, userId: true })
  .extend({
    text: z
      .string()
      .max(200, "A comment cannot be longer than 200 characters."),
  });

export const insertLikeSchema = createInsertSchema(likesTable).pick({
  postId: true,
});

export const insertSubscriptionSchema = createInsertSchema(
  roomSubscriptionsTable
).omit({ id: true });

export const insertListingSchema = createInsertSchema(listingsTable).omit({
  id: true,
});
