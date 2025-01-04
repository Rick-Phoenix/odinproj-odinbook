import { CookieStore, sessionMiddleware } from "hono-sessions";
import type { AppOpenAPI } from "../types/app-bindings";
import env from "../types/env";

const store = new CookieStore();

export const sessionConfig = (app: AppOpenAPI) => {
  app.use(
    "*",
    sessionMiddleware({
      store,
      encryptionKey: env.SESSION_ENCRYPTION_KEY,
      expireAfterSeconds: 900,
      cookieOptions: {
        sameSite: "Lax",
        path: "/",
        httpOnly: true,
      },
    })
  );
};
