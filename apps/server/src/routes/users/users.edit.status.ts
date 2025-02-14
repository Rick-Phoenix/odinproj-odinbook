import { createRoute, z } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { updateUserStatus } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { updateStatusSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["users"];

export const modifyUserStatus = createRoute({
  path: "/edit/status",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(updateStatusSchema, "The new status."),
  },
  responses: {
    [OK]: jsonContent(
      z.object({ newStatus: z.string() }),
      "The updated status."
    ),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const modifyUserStatusHandler: AppRouteHandler<
  typeof modifyUserStatus,
  AppBindingsWithUser
> = async (c) => {
  const userId = getUserId(c);
  const { status } = c.req.valid("json");
  const { newStatus } = await updateUserStatus(userId, status);
  if (!newStatus)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json({ newStatus }, OK);
};
