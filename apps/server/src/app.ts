import { serveStatic } from "@hono/node-server/serve-static";
import { v2 as cloudinary } from "cloudinary";
import { csrf } from "hono/csrf";
import createApp from "./lib/create-app.js";
import configureOpenApiReference from "./lib/openapi-config.js";
import { registerUser } from "./middlewares/auth-middleware";
import { protectRoute, rejectIfAlreadyLogged } from "./middlewares/auth-middleware.js";
import { apiRoutes } from "./routes/routing-config.js";
import env from "./types/env.js";

const app = createApp();

// Global Middleware
app.use(csrf());
app.use(registerUser);
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
