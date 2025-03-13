import { z } from "@hono/zod-openapi";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "path";

expand(config({ path: path.resolve(process.cwd(), "../../.env") }));

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("warn"),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URI: z.string(),
  SESSION_ENCRYPTION_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  VITE_REMOTE_DEV: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default("false"),
});

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as z.ZodError;
  console.error("Invalid Env:");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
export type env = z.infer<typeof EnvSchema>;
