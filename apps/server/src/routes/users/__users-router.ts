import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { modifyUserProfile, modifyUserProfileHandler } from "./avatar.patch";
import { modifyUserPassword, modifyUserPasswordHandler } from "./password.patch";
import { modifyUserStatus, modifyUserStatusHandler } from "./status.patch";
import { deleteUser, deleteUserHandler } from "./user.delete";
import { user, userHandler } from "./user.get";
import { getUserProfile, getUserProfileHandler } from "./username.get";

export const userRouter = createRouter<AppBindingsWithUser>()
  .openapi(user, userHandler)
  .openapi(getUserProfile, getUserProfileHandler)
  .openapi(modifyUserProfile, modifyUserProfileHandler)
  .openapi(modifyUserStatus, modifyUserStatusHandler)
  .openapi(modifyUserPassword, modifyUserPasswordHandler)
  .openapi(deleteUser, deleteUserHandler);
