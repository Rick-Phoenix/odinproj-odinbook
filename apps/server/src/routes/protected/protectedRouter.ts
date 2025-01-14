import { createRouter } from "../../lib/create-app";
import { home, homeHandler } from "./user";

export const protectedRouter = createRouter().openapi(home, homeHandler);
