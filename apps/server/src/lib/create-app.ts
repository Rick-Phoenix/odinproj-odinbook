import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "../middlewares/pino-logger";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import type { AppBindings } from "../types/app-bindings";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    // defaultHook,
    defaultHook: (result, c) => {
      if (!result.success && result.error.issues[0].code === "custom") {
        result.error.issues[0].params;
      }
    },
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(pinoLogger());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}
