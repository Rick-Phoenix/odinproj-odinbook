import { createRouter } from "../lib/create-app";
import type { AppOpenAPI } from "../lib/types";
import { indexRouter } from "./index.route";
import { usersRouter } from "./users";

const app = createRouter();

const routers = [indexRouter, usersRouter] as const;

export function fullRouterConfig(app: AppOpenAPI) {
  for (const router of routers) {
    app.route("/", router);
  }

  return app;
}

const apiRoutes = fullRouterConfig(app);
export type ApiRoutes = typeof apiRoutes;
