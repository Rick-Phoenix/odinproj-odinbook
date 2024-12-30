import { auth } from "@/lib/auth";
import configureOpenApiReference from "./lib/configure-open-api-reference.js";
import createApp from "./lib/create-app.js";
import { fullRouterConfig } from "./routes/index.js";

const app = fullRouterConfig(createApp());

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

configureOpenApiReference(app);

export default app;
