import { createRouter } from "../lib/create-app";
import type { AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { chatRouter } from "./chats/chatsRouter";
import { userRouter } from "./users/userRouter";

const app = createRouter();

export function registerApiRoutes(app: AppOpenAPI) {
  return app
    .route("/auth", authRouter)
    .route("/users", userRouter)
    .route("/chats", chatRouter);
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
