import { createRouter } from "../../lib/create-app";
import {
  github,
  githubCallback,
  githubCallbackHandler,
  githubHandler,
} from "./github";
import { login, loginHandler } from "./login";
import { logout, logoutHandler } from "./logout";
import { signup, signupHandler } from "./signup";

export const authRouter = createRouter()
  .openapi(login, loginHandler)
  .openapi(signup, signupHandler)
  .openapi(logout, logoutHandler)
  .openapi(github, githubHandler)
  .openapi(githubCallback, githubCallbackHandler);
