import { createRouter } from "../lib/create-app";
import type { AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { userRouter } from "./user/userRouter";

const app = createRouter();

export function registerApiRoutes(app: AppOpenAPI) {
  return app.route("/auth", authRouter).route("/user", userRouter);
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
