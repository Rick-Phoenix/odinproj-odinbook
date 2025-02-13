import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { modifyUserPassword, modifyUserPasswordHandler } from "./password";
import { getUserProfile, getUserProfileHandler } from "./users.$username";
import {
  modifyUserProfile,
  modifyUserProfileHandler,
} from "./users.edit.avatar";
import { modifyUserStatus, modifyUserStatusHandler } from "./users.edit.status";
import { user, userHandler } from "./users.user";

export const userRouter = createRouter<AppBindingsWithUser>()
  .openapi(user, userHandler)
  .openapi(getUserProfile, getUserProfileHandler)
  .openapi(modifyUserProfile, modifyUserProfileHandler)
  .openapi(modifyUserStatus, modifyUserStatusHandler)
  .openapi(modifyUserPassword, modifyUserPasswordHandler);
