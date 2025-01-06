
import { createRoute, z } from "@hono/zod-openapi";
import { httpCodes, notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import type { AppRouteHandler } from "../../types/app-bindings";

const tags = ["auth"]