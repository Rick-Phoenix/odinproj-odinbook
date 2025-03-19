import { OpenAPIHono } from "@hono/zod-openapi";
import { v2 as cloudinary } from "cloudinary";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";
import { UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { onError } from "stoker/middlewares";
import {
  protectRoute,
  registerSession,
  rejectIfAlreadyLogged,
} from "../middlewares/auth-middleware";
import type { AppBindings } from "../types/app-bindings";
import env from "../types/env";
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

export default function createApp<AB extends AppBindings = AppBindings>() {
  const app = createRouter<AB>();

  // Global Middleware
  app.use(csrf(), etag());
  app.use(registerSession);
  app.use(async (c, next) => {
    cloudinary.config({
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
    });

    await next();
  });

  // Route Specific Middleware
  app.use("/api/*", protectRoute);
  app.use("/api/auth/*", rejectIfAlreadyLogged);

  // Logging
  app.use(pinoLogger());

  // Error Handling
  app.notFound((c) => {
    return c.json("Not Found", 404);
  });
  app.onError(onError);

  return app;
}
