import { serveStatic } from "@hono/node-server/serve-static";
import { sessionConfig } from "./lib/auth.js";
import configureOpenApiReference from "./lib/configure-open-api-reference.js";
import createApp from "./lib/create-app.js";
import { apiRoutes } from "./routes/routeConfig";
import env from "./types/env.js";

const app = createApp();

sessionConfig(app);
configureOpenApiReference(app);

// const api = createRouter();
// const apiRoutes = registerApiRoutes(api);

app.route("/api", apiRoutes);

if (env.NODE_ENV === "development") {
  app.get("*", serveStatic({ path: "./src/index.html" }));
}
if (env.NODE_ENV === "production") {
  app.get("*", serveStatic({ root: "./public" }));
  app.get("*", serveStatic({ path: "./public/index.html" }));
}

export default app;
