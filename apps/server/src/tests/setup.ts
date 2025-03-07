import { afterAll, beforeAll, vi } from "vitest";

beforeAll(() => {
  vi.mock("../types/env", () => {
    return {
      default: {
        NODE_ENV: "test",
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
      },
    };
  });
});

afterAll(() => {});
