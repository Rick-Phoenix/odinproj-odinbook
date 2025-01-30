import env from "@/types/env.js";
import { serve } from "@hono/node-server";
import app from "./app.js";
import { injectWebSocket } from "./routes/routingConfig.js";

const port = env.PORT;

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
