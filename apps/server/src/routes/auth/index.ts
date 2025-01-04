import { createRouter } from "../../lib/create-app";
import { login, loginHandler } from "./login";

export const authRouter = createRouter().openapi(login, loginHandler);
