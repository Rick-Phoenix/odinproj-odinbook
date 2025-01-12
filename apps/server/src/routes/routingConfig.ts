import { createRouter } from "../lib/create-app";
import type { AppOpenAPI } from "../types/app-bindings";
import { authRouter } from "./auth/authRouter";
import { protectedRouter } from "./protected/protectedRouter";
export type { Schema } from "hono";

const app = createRouter();

export function registerApiRoutes(app: AppOpenAPI) {
  return app.route("/auth", authRouter).route("/protected", protectedRouter);
}

export const apiRoutes = registerApiRoutes(app);
export type ApiRoutes = typeof apiRoutes;
