import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type env from "../env";
import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
  Bindings: typeof env;
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
