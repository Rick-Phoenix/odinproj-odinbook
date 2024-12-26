import configureOpenApiReference from "./lib/configure-open-api-reference.js";
import createApp from "./lib/create-app.js";
import index from "@/routes/index.route.js";
import { usersRouter } from "./routes/users/index.js";

const app = createApp();

const routers = [index, usersRouter];

configureOpenApiReference(app);

routers.forEach((router) => {
  app.route("/", router);
});

export default app;
