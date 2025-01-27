import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { user, userHandler } from "./user";

export const userRouter = createRouter<AppBindingsWithUser>().openapi(
  user,
  userHandler
);
