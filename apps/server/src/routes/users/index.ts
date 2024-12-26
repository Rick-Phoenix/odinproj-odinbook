import { createRouter } from "@/lib/create-app.js";
import { usersRoute } from "./routes.js";
import { usersHandler } from "./handlers.js";

export const usersRouter = createRouter().openapi(usersRoute, usersHandler);
