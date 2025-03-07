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
  //vi.stubEnv("NODE_ENV", "test");
  //vi.stubEnv("GITHUB_CLIENT_ID", "");
  //vi.stubEnv("GITHUB_CLIENT_SECRET", "");
  //vi.stubEnv("GITHUB_CALLBACK_URI", "");
  //vi.stubEnv("SESSION_ENCRYPTION_KEY", "");
  //vi.stubEnv("CLOUDINARY_CLOUD_NAME", "");
  //vi.stubEnv("CLOUDINARY_API_KEY", "");
  //vi.stubEnv("CLOUDINARY_API_SECRET", "");
});

afterAll(() => {
  //vi.unstubAllEnvs();
});
