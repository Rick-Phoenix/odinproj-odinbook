import type { AppContextWithUser } from "../types/app-bindings";

export function getUserId(c: AppContextWithUser) {
  return c.var.user.id;
}
