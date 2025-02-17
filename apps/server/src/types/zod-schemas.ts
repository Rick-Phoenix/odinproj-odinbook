import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  chats,
  comments,
  itemConditions,
  listings,
  marketplaceCategories,
  messages,
  postLikes,
  posts,
  roomCategoriesArray,
  rooms,
  sessions,
  subs,
  users,
} from "../db/schema";

// Database Schemas
export const userSchema = createSelectSchema(users);
export const sessionSchema = createSelectSchema(sessions);

export const messagesSchema = createSelectSchema(messages);
export const chatSchema = createSelectSchema(chats).extend({
  messages: z.array(messagesSchema),
  contact: z.object({
    username: z.string(),
    avatarUrl: z.string(),
    id: z.string(),
  }),
});

export const commentSchema = createSelectSchema(comments).extend({
  author: z.object({ username: z.string(), avatarUrl: z.string() }),
  isLiked: z.boolean(),
});
export const likesSchema = createSelectSchema(postLikes);
export const basicPostSchema = createSelectSchema(posts).extend({
  author: z.string(),
  isLiked: z.boolean(),
});
export type BasicPost = z.infer<typeof basicPostSchema>;
export const roomSchema = createSelectSchema(rooms).extend({
  isSubscribed: z.boolean(),
});
export const fullPostSchema = basicPostSchema.extend({
  comments: z.array(commentSchema),
  room: roomSchema,
});
export const userFeedSchema = z.array(basicPostSchema);

export const roomWithPostsSchema = roomSchema.extend({
  posts: z.array(basicPostSchema),
  totalPosts: z.number(),
});
export type RoomData = z.infer<typeof roomSchema>;

export const listingSchema = createSelectSchema(listings).extend({
  seller: z.string(),
  isSaved: z.boolean(),
});

export const userDataSchema = userSchema.extend({
  subsContent: z.object({
    rooms: z.array(roomSchema),
    suggestedRooms: z.array(roomSchema),
    posts: z.array(basicPostSchema),
  }),
  totalFeedPosts: z.number(),
  totalLikes: z.number(),
  totalPosts: z.number(),
  totalRoomsCreated: z.number(),
  totalListings: z.number(),
  listingsCreated: z.array(listingSchema),
  listingsSaved: z.array(z.object({ listing: listingSchema })),
  favoriteListingsCategory: z.enum(marketplaceCategories).nullable(),
  ownChats: z.array(chatSchema),
});

export const profileSchema = userSchema
  .pick({
    avatarUrl: true,
    status: true,
    createdAt: true,
    username: true,
    id: true,
  })
  .extend({
    comments: z.array(
      commentSchema
        .extend({
          post: z.object({
            title: z.string(),
            room: z.object({ name: z.string() }),
            id: z.number(),
          }),
        })
        .omit({ author: true, isLiked: true })
    ),
    posts: z.array(
      z.object({
        text: z.string(),
        title: z.string(),
        room: z.object({
          name: z.string(),
        }),
        id: z.number(),
        createdAt: z.string(),
      })
    ),
    listingsCreated: z.array(listingSchema),
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

export const insertRoomSchema = z.object({
  name: z.string().max(20, "The name cannot be longer than 20 characters."),
  description: z.string().max(150, "The description cannot be longer than 150 characters."),
  category: z.enum(roomCategoriesArray),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 30000, "The avatar cannot be larger than 3 megabytes.")
    .optional(),
});
export { roomCategoriesArray } from "../db/schema";

export const insertPostSchema = z.object({
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
    text: z.string().max(200, "A comment cannot be longer than 200 characters."),
  });

export const insertLikeSchema = createInsertSchema(postLikes).pick({
  postId: true,
});

export const insertSubscriptionSchema = createInsertSchema(subs).omit({
  id: true,
});

export { itemConditions, marketplaceCategories } from "../db/schema";
export const insertListingSchema = z.object({
  title: z
    .string()
    .min(10, "The title must be at least 10 characters long.")
    .max(30, "The title cannot be longer than 30 characters."),
  description: z.string().max(250, "The description cannot be longer than 250 characters."),
  price: z.coerce
    .number()
    .positive()
    .int()
    .min(1, "Price cannot be less than $1.")
    .max(300000, "Price cannot be more than 300000")
    .transform((n) => {
      const stringNum = n.toString().split("");
      let i = 0;
      while (i < stringNum.length && stringNum[i] === "0") i++;
      return Number(stringNum.slice(i).join(""));
    }),
  location: z.string(),
  category: z.enum(marketplaceCategories),
  condition: z.enum(itemConditions),
  pic: z
    .instanceof(File)
    .refine((file) => file.size <= 1000000, "The picture cannot be larger than one megabyte.")
    .optional(),
});
export type ListingInputs = Omit<z.infer<typeof insertListingSchema>, "pic"> & {
  picUrl: string | undefined;
};

export const insertMessageSchema = z.object({
  text: z.string().min(1).max(1000),
  receiverId: z.string(),
  chatId: z.number().optional(),
});

export const updateStatusSchema = z.object({
  status: z.string().max(100, "The status cannot be longer than 100 characters."),
});

export const updateAvatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 1000000,
      "The profile picture cannot be larger than 1 megabyte."
    ),
});

export const passwordSchema = z
  .string()
  .min(8, "The password must be at least 8 characters long.")
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ .%^&*-]).{8,}$/,
    "The password must contain at least one uppercase letter, one lowercase letter, a number and a special character."
  )
  .max(255, "The password cannot be longer than 255 characters.");

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().refine((v) => passwordSchema.safeParse(v).success, "Invalid password."),
    newPassword: passwordSchema,
    passConfirm: z.string(),
  })
  .refine(
    ({ newPassword, passConfirm }) => newPassword === passConfirm,
    "The passwords do not coincide."
  );
