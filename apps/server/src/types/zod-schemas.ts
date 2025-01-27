import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  chatInstances,
  chats,
  comments,
  likes,
  listingPics,
  listings,
  messages,
  posts,
  rooms,
  roomSubs,
  sessions,
  users,
} from "../db/schema";

// Database Schemas
export const userSchema = createSelectSchema(users);
export const sessionSchema = createSelectSchema(sessions);

export const messagesSchema = createSelectSchema(messages);
export const chatSchema = createSelectSchema(chats).extend({
  messages: z.array(messagesSchema),
  contact: z.object({ username: z.string(), avatarUrl: z.string().nullable() }),
});
export const chatInstanceSchema = createSelectSchema(chatInstances).extend({
  chat: chatSchema,
});

export const commentSchema = createSelectSchema(comments);
export const likesSchema = createSelectSchema(likes);
export const postSchema = createSelectSchema(posts).extend({
  comments: z.array(commentSchema),
  likes: z.array(likesSchema),
});
export const roomSchema = createSelectSchema(rooms).extend({
  posts: z.array(postSchema),
});

export const listingPicsSchema = createSelectSchema(listingPics);
export const listingSchema = createSelectSchema(listings).extend({
  pics: z.array(listingPicsSchema),
});

// Input Validation Schemas

export const insertUserSchema = createInsertSchema(users)
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

export const insertRoomSchema = createInsertSchema(rooms)
  .pick({ category: true, name: true })
  .extend({
    name: z.string().max(20, "The name cannot be longer than 20 characters."),
  });

export const insertPostSchema = createInsertSchema(posts)
  .omit({ createdAt: true, id: true, authorId: true })
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

export const insertCommentSchema = createInsertSchema(comments)
  .omit({ createdAt: true, id: true, userId: true })
  .extend({
    text: z
      .string()
      .max(200, "A comment cannot be longer than 200 characters."),
  });

export const insertLikeSchema = createInsertSchema(likes).pick({
  postId: true,
});

export const insertSubscriptionSchema = createInsertSchema(roomSubs).omit({
  id: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
});
