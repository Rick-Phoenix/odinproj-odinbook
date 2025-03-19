import Redis from "ioredis";
import env from "../types/env";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

const shutdown = () => {
  redis
    .quit()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(`Error while shutting down Redis: ${e}`);
      process.exit(0);
    });
};
process.on("SIGINT", shutdown);
