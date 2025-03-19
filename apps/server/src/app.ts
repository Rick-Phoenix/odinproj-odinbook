import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import createApp from "./lib/create-app.js";
import { devHtmlHandler } from "./lib/dev-html-handler.js";
import configureOpenApiReference from "./lib/openapi-config.js";
import { apiRoutes } from "./routes/routing-config.js";
import env from "./types/env";

const app = createApp();

// OpenAPI Endpoints
configureOpenApiReference(app);

// Api Routes Configuration
app.route("/api", apiRoutes);

// Static Assets Serving
if (env.NODE_ENV === "development") {
  app.get("*", devHtmlHandler);
}
if (env.NODE_ENV === "production") {
  app.use(compress());
  app.get(
    "*",
    async (c, next) => {
      c.header("Cache-Control", "public, max-age=31536000, immutable");
      c.header("Vary", "Accept-Encoding");
      await next();
    },
    serveStatic({ root: "./_static" })
  );
  app.get(
    "*",
    async (c, next) => {
      c.header("Cache-Control", "no-cache");
      c.header("Vary", "Accept-Encoding");
      await next();
    },
    serveStatic({ path: "./_static/index.html" })
  );
}

export default app;
