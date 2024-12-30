import type { ApiRoutes } from "@nexus/hono-api/routes";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("");
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<ApiRoutes>(...args);
