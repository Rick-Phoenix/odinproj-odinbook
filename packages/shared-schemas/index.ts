import type { ApiRoutes } from "@nexus/hono-api/routes";
import * as zodSchemas from "@nexus/hono-api/schemas";
import { hc } from "hono/client";
import { z } from "zod";

// Shared Types
export type User = z.infer<typeof schemas.userSchema>;
export const schemas = zodSchemas;

// Api Client
const client = hc<ApiRoutes>("");
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<ApiRoutes>(...args);
