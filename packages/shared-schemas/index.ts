import type { ApiRoutes } from "@nexus/hono-api/routes";
import * as schemas from "@nexus/hono-api/schemas";
import { hc } from "hono/client";
import { z } from "zod";
export type {
  ClientRequest,
  ClientRequestOptions,
  ClientResponse,
  Fetch,
  InferRequestType,
  InferResponseType,
} from "hono/client";

// Shared Types
export type User = z.infer<typeof schemas.userSchema>;
export type Session = z.infer<typeof schemas.sessionSchema>;
export const zodSchemas = schemas;

// Api Client
const client = hc<ApiRoutes>("");
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<ApiRoutes>(...args);
