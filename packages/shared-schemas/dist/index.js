import { hc } from "hono/client";
export { basicPostSchema, chatSchema, commentSchema, fullPostSchema, insertCommentSchema, insertListingSchema, insertMessageSchema, insertPostSchema, insertRoomSchema, insertUserSchema, itemConditions, listingSchema, loginValidationSchema, marketplaceCategories, messagesSchema, profileSchema, roomCategoriesArray, roomSchema, updatePasswordSchema, updateStatusSchema, userDataSchema, } from "@nexus/hono-api/schemas";
// Api Client
const client = hc("");
export default (...args) => hc(...args);
