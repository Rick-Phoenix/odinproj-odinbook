
import { createRoute, z } from "@hono/zod-openapi";
import { OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { AppRouteHandler , AppBindingsWithUser } from "../../types/app-bindings";

const tags = ["chats"]

export const test = createRoute({
  path: '/',
  method: 'post',
  tags,
  request: {
    body: {
        
      }
  },
  responses: {
    [OK]:
  }
});

export const testHandler: AppRouteHandler<typeof test, AppBindingsWithUser> = async (c) => {
  
}
