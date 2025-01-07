import { createRouter } from "../../lib/create-app";
import { login, loginHandler } from "./login";
import { signup, signupHandler } from "./signup";

export const authRouter = createRouter()
  .openapi(login, loginHandler)
  .openapi(signup, signupHandler);
