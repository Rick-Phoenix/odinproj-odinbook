import { serveStatic } from "@hono/node-server/serve-static";
import createApp from "./lib/create-app.js";
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
  app.get("*", serveStatic({ path: "./src/dev.index.html" }));
}
if (env.NODE_ENV === "production") {
  app.get("*", serveStatic({ root: "./_static" }));
  app.get("*", serveStatic({ path: "./src/index.html" }));
}

export default app;
