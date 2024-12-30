import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "../middlewares/pino-logger";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(pinoLogger());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}
