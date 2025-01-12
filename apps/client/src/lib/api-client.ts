import RPC from "@nexus/api-client";
import type {
  ClientRequest,
  Client,
  ClientRequestOptions,
  ClientResponse,
  InferRequestType,
  InferResponseType,
  Fetch,
  Schema,
} from "@nexus/api-client";

export const api = RPC("/api");
