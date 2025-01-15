import { OpenAPIHono } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { notFound, onError } from "stoker/middlewares";
import { pinoLogger } from "../middlewares/pino-logger";
import type { AppBindings } from "../types/app-bindings";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            issues: result.error.issues,
            name: result.error.name,
          },
          UNPROCESSABLE_ENTITY
        );
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
