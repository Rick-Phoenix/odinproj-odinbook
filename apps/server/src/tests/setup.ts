import { afterAll, beforeAll, vi } from "vitest";

beforeAll(() => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("GITHUB_CLIENT_ID", "");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "");
  vi.stubEnv("GITHUB_CALLBACK_URI", "");
  vi.stubEnv("SESSION_ENCRYPTION_KEY", "");
  vi.stubEnv("CLOUDINARY_CLOUD_NAME", "");
  vi.stubEnv("CLOUDINARY_API_KEY", "");
  vi.stubEnv("CLOUDINARY_API_SECRET", "");
});

afterAll(() => {
  vi.unstubAllEnvs();
});
