import { createRouter } from "../../lib/create-app";
import { home, homeHandler } from "./home";

export const protectedRouter = createRouter().openapi(home, homeHandler);
