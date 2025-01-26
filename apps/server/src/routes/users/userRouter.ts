import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { user, userHandler } from "./userRoot";

export const userRouter = createRouter<AppBindingsWithUser>().openapi(
  user,
  userHandler
);
