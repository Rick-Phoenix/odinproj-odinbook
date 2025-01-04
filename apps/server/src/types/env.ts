import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "@hono/zod-openapi";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SESSION_ENCRYPTION_KEY: z.string(),
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
