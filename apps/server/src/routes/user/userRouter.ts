import { createRouter } from "../../lib/create-app";
import type { AppBindingsWithUser } from "../../types/app-bindings";
import { userRoot, userRootHandler } from "./userRoot";

export const userRouter = createRouter<AppBindingsWithUser>().openapi(
  userRoot,
  userRootHandler
);
