import { serveStatic } from "@hono/node-server/serve-static";
import configureOpenApiReference from "./lib/configure-open-api-reference.js";
import createApp from "./lib/create-app.js";
import { apiRoutes } from "./routes/routingConfig.js";
import env from "./types/env.js";
import { csrf } from "hono/csrf";
import { validateSession } from "./utils/session.js";

const app = createApp();

app.use(csrf());

app.use(validateSession);

// app.use(async (c, next) => {
//   console.log(c.var.user);
//   await next();
// });

configureOpenApiReference(app);

app.route("/api", apiRoutes);

if (env.NODE_ENV === "development") {
  app.get("*", serveStatic({ path: "./src/index.html" }));
}
if (env.NODE_ENV === "production") {
  app.get("*", serveStatic({ root: "./public" }));
  app.get("*", serveStatic({ path: "./public/index.html" }));
}

export default app;
