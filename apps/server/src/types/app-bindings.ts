import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type env from "./env";
import type { PinoLogger } from "hono-pino";
import type { Session } from "hono-sessions";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    session: Session;
    session_key_rotation: boolean;
  };
  Bindings: typeof env;
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
