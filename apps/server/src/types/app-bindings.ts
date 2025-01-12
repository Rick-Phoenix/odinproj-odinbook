import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type env from "./env";
import type { PinoLogger } from "hono-pino";
import type { Context, MiddlewareHandler } from "hono";
import type { Session } from "./db-items";
import type { User } from "./db-items";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    session: Session | null;
    user: User | null;
  };
  Bindings: typeof env;
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export type AppMiddleware = MiddlewareHandler<AppBindings>;

export type AppContext = Context<AppBindings>;
