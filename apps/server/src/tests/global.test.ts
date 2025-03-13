import { serveStatic } from "@hono/node-server/serve-static";
import { expect, it, vi } from "vitest";
import createApp from "../lib/create-app";
import { devHtmlHandler } from "../lib/dev-html-handler";
import { apiRoutes } from "../routes/routing-config";
import env from "../types/env";

const app = createApp();

// Api Routes Configuration
app.route("/api", apiRoutes);

// Static Assets Serving
if (env.NODE_ENV === "development") {
  app.get("*", devHtmlHandler);
}

if (env.NODE_ENV === "production") {
  app.get("*", serveStatic({ root: "./_static" }));
  app.get("*", serveStatic({ path: "./_static/index.html" }));
}

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

it("Serves the dev.index.html file in development", async () => {
  vi.mock("../types/env", () => ({
    default: {
      NODE_ENV: "development",
      PORT: 3000,
      DATABASE_URL: "",
      LOG_LEVEL: "info",
      GITHUB_CLIENT_ID: "",
      GITHUB_CLIENT_SECRET: "",
      GITHUB_CALLBACK_URI: "",
      SESSION_ENCRYPTION_KEY: "",
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      REDIS_PASSWORD: "",
    },
  }));
  const res = await app.request("/");
  expect(res.headers.get("Content-Type")).toMatch(/text\/html/);
});

it("Serves from the _static folder in production", async () => {
  vi.mock("../types/env", () => ({
    default: {
      NODE_ENV: "production",
      PORT: 3000,
      DATABASE_URL: "",
      LOG_LEVEL: "info",
      GITHUB_CLIENT_ID: "",
      GITHUB_CLIENT_SECRET: "",
      GITHUB_CALLBACK_URI: "",
      SESSION_ENCRYPTION_KEY: "",
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      REDIS_PASSWORD: "",
    },
  }));
  const res = await app.request("/");
  expect(res.headers.get("Content-Type")).toMatch(/text\/html/);
});
