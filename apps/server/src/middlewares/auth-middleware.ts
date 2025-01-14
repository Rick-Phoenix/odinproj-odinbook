import { CONFLICT, UNAUTHORIZED } from "stoker/http-status-codes";
import type { AppMiddleware } from "../types/app-bindings";
import { accessDeniedError, alreadyLoggedError } from "../utils/customErrors";
import { userIsAuthenticated } from "../utils/session";

export const protectRoute: AppMiddleware = async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) return await next();
  if (!userIsAuthenticated(c))
    return c.json(accessDeniedError.content, UNAUTHORIZED);
  await next();
};

export const rejectIfAlreadyLogged: AppMiddleware = async (c, next) => {
  if (c.req.path === "/api/auth/logout") return await next();
  if (userIsAuthenticated(c))
    return c.json(alreadyLoggedError.content, CONFLICT);
  await next();
};
