import type { ApiRoutes } from "@nexus/hono-api/routes";
import { hc } from "hono/client";
export {
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
} from "@nexus/hono-api/schemas";

// Api Client
const client = hc<ApiRoutes>("");
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<ApiRoutes>(...args);
