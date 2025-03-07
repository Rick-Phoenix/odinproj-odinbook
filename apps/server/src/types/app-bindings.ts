import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Context, Env, MiddlewareHandler } from "hono";
import type { PinoLogger } from "hono-pino";
import type { Session, User } from "./db-items";
import type env from "./env";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    session: Session | null;
    user: User | null;
  };
  Bindings: typeof env;
};

export type AppBindingsWithUser = AppBindings & { Variables: { user: User } };

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig, AB extends Env = AppBindings> = RouteHandler<
  R,
  AB
>;

export type AppMiddleware = MiddlewareHandler<AppBindings>;

export type AppContext = Context<AppBindings>;
export type AppContextWithUser = Context<AppBindingsWithUser>;
