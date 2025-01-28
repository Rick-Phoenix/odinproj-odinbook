import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { StatusCode } from "hono/utils/http-status";

import type { Context, Env, MiddlewareHandler, TypedResponse } from "hono";
import type { PinoLogger } from "hono-pino";
import type { ResponseFormat } from "hono/types";
import superjson from "superjson";
import type { SuperJSONValue } from "superjson/dist/types";
import type { Session, User } from "./db-items";
import type env from "./env";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    session: Session | null;
    user: User | null;
  };
  Bindings: typeof env;
};

export type AppBindingsWithUser = AppBindings & { Variables: { user: User } };

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<
  R extends RouteConfig,
  AB extends Env = AppBindings,
> = RouteHandler<R, AB>;

export type AppMiddleware = MiddlewareHandler<AppBindings>;

export type AppContext = Context<AppBindings>;
export type AppContextWithUser = Context<AppBindingsWithUser>;

declare type PrimitiveJSONValue = string | number | boolean | undefined | null;
declare type JSONValue = PrimitiveJSONValue | JSONArray | JSONObject;
interface JSONArray extends Array<JSONValue> {}
interface JSONObject {
  [key: string]: JSONValue;
}
declare type ClassInstance = any;
declare type SerializableJSONValue =
  | symbol
  | Set<SuperJSONValue>
  | Map<SuperJSONValue, SuperJSONValue>
  | undefined
  | bigint
  | Date
  | ClassInstance
  | RegExp;
declare type SuperJSONValue =
  | JSONValue
  | SerializableJSONValue
  | SuperJSONArray
  | SuperJSONObject;
interface SuperJSONArray extends Array<SuperJSONValue> {}
interface SuperJSONObject {
  [key: string]: SuperJSONValue;
}

type HeaderRecord = Record<string, string | string[]>;

const getSuperjsonResponse = <
  T,
  F extends ResponseFormat = ResponseFormat,
  S extends StatusCode = StatusCode,
>(
  object: T extends SuperJSONValue ? T : SuperJSONValue,
  arg: S,
  format: F
): TypedResponse<T, S, F> => {
  const _data = superjson.stringify(object);
  const _format = format;
  const _status = arg;
  return { _data, _status, _format };
  // return typeof arg === "number"
  //   ? c.newResponse(body, arg, headers)
  //   : c.newResponse(body, arg);
};

export const jsonS = <T, S extends StatusCode>(
  c: AppContextWithUser,
  object: T extends SuperJSONValue ? T : SuperJSONValue,
  arg: S
) => {
  c.header("content-type", "application/json; charset=UTF-8");
  c.header("x-superjson", "true");
  return getSuperjsonResponse(object, arg, "json");
};
