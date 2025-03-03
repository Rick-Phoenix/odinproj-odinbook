import {
  basicPostSchema,
  chatSchema,
  commentSchema,
  fullPostSchema,
  insertCommentSchema,
  insertListingSchema,
  insertMessageSchema,
  insertPostSchema,
  insertRoomSchema,
  insertUserSchema,
  itemConditions,
  listingSchema,
  loginValidationSchema,
  marketplaceCategories,
  messagesSchema,
  profileSchema,
  roomCategoriesArray,
  roomSchema,
  updatePasswordSchema,
  updateStatusSchema,
  userDataSchema,
} from "@nexus/shared-schemas";
import type { z } from "zod";

export type Message = z.infer<typeof messagesSchema>;
export type Chat = z.infer<typeof chatSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type PostBasic = z.infer<typeof basicPostSchema>;
export type PostFull = z.infer<typeof fullPostSchema>;
export type Room = z.infer<typeof roomSchema>;
export type RoomInputs = z.infer<typeof insertRoomSchema>;
export interface InitialFeed {
  posts: PostBasic[];
  total: number;
}
export type SortingOrder = "likesCount" | "createdAt";
export type ListingInputs = z.infer<typeof insertListingSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type ListingCategory = (typeof marketplaceCategories)[number];
export type Comment = z.infer<typeof commentSchema> & {
  children?: Comment[];
};
export type LikeData = { isLiked: boolean; likesCount: number };
export type Post = PostBasic | PostFull;
export type User = z.infer<typeof userDataWithoutExtras>;
export {
  insertCommentSchema,
  insertListingSchema,
  insertMessageSchema,
  insertPostSchema,
  insertRoomSchema,
  insertUserSchema,
  itemConditions,
  loginValidationSchema,
  marketplaceCategories,
  roomCategoriesArray,
  updatePasswordSchema,
  updateStatusSchema,
};
const userDataWithoutExtras = userDataSchema.omit({
  subsContent: true,
  listingsCreated: true,
  listingsSaved: true,
  ownChats: true,
});
