import Redis from "ioredis";
import env from "../types/env";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

async function testRedis() {
  try {
    await redis.set("mykey", "Hello Redis");
    console.log("Key set successfully");

    const value = await redis.get("mykey");
    console.log("Value from Redis:", value);

    await redis.quit();
    console.log("Connection closed successfully");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}

await testRedis();

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
