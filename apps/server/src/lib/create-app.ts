import { OpenAPIHono } from "@hono/zod-openapi";
import { UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { onError } from "stoker/middlewares";
import type { AppBindings } from "../types/app-bindings";
import { pinoLogger } from "./pino-logger";

export function createRouter<AB extends AppBindings = AppBindings>() {
  return new OpenAPIHono<AB>({
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
  app.notFound((c) => {
    return c.json("Not Found", 404);
  });
  app.onError(onError);
  return app;
}
