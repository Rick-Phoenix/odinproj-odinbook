import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { user, userHandler } from "./user";
import { getUserProfile, getUserProfileHandler } from "./userId";

export const userRouter = createRouter<AppBindingsWithUser>()
  .openapi(user, userHandler)
  .openapi(getUserProfile, getUserProfileHandler);
