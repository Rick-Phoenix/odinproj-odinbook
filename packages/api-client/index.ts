import type { ApiRoutes, Schema } from "@nexus/hono-api/routes";
export type { Schema } from "@nexus/hono-api/routes";
import { hc } from "hono/client";
export type {
  ClientRequest,
  ClientRequestOptions,
  ClientResponse,
  Fetch,
  InferRequestType,
  InferResponseType,
} from "hono/client";
export { zodSchemas } from "@nexus/hono-api/types";
import type { dbtypes } from "@nexus/hono-api/types";
const client = hc<ApiRoutes>("");

export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client =>
  hc<ApiRoutes>(...args);
