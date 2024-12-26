import type { AppRouteHandler } from "@/lib/types.js";
import type { UsersRoute } from "./routes.js";

export const usersHandler: AppRouteHandler<UsersRoute> = (c) => {
  return c.json(["Example"], 200);
};
