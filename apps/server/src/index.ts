import { serve } from "@hono/node-server";
import app from "./app.js";
import { injectWebSocket } from "./routes/routing-config.js";
import env from "./types/env";

const port = env.PORT;

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
