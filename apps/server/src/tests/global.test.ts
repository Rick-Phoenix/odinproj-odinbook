import { serveStatic } from "@hono/node-server/serve-static";
import { expect, it } from "vitest";
import createApp from "../lib/create-app";
import configureOpenApiReference from "../lib/openapi-config";
import { apiRoutes } from "../routes/routing-config";
import env from "../types/env";

const app = createApp();

// OpenAPI Endpoints
configureOpenApiReference(app);

// Api Routes Configuration
app.route("/api", apiRoutes);

// Static Assets Serving
if (env.NODE_ENV === "test") {
  app.get("*", serveStatic({ path: "./src/dev.index.html" }));
}

//if (env.NODE_ENV === "production") {
//  app.get("*", serveStatic({ root: "./_static" }));
//  app.get("*", serveStatic({ path: "./src/index.html" }));
//}

it("Rejects unauthenticated requests", async () => {
  const protectedRoutes = ["/api/users", "/api/chats", "/api/listings", "/api/posts", "/api/rooms"];
  for (const route of protectedRoutes) {
    const res = await app.request(route);
    expect(res.status).toEqual(401);
  }
});

it("Allows unauthenticated requests for login and signup", async () => {
  const authRoutes = ["/api/auth/login", "/api/auth/signup"];
  for (const route of authRoutes) {
    const res = await app.request(route, { method: "POST" });
    expect(res.status).not.toEqual(401);
  }
});

it("Serves static files for non-api routes", async () => {
  const res = await app.request("/");
  expect(res.headers.get("Content-Type")).toMatch(/text\/html/);
});
