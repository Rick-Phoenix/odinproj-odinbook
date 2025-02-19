import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { getUserProfile, getUserProfileHandler } from "./users.$username";
import { modifyUserProfile, modifyUserProfileHandler } from "./users.edit.avatar";
import { modifyUserPassword, modifyUserPasswordHandler } from "./users.edit.password";
import { modifyUserStatus, modifyUserStatusHandler } from "./users.edit.status";
import { user, userHandler } from "./users.user";
import { deleteUser, deleteUserHandler } from "./users.user.delete";

export const userRouter = createRouter<AppBindingsWithUser>()
  .openapi(user, userHandler)
  .openapi(getUserProfile, getUserProfileHandler)
  .openapi(modifyUserProfile, modifyUserProfileHandler)
  .openapi(modifyUserStatus, modifyUserStatusHandler)
  .openapi(modifyUserPassword, modifyUserPasswordHandler)
  .openapi(deleteUser, deleteUserHandler);
