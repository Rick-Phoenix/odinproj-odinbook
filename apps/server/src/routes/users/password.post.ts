import { verifyPasswordHash } from "@/lib/auth";
import { inputErrorResponse, okResponse } from "@/schemas/response-schemas";
import { createRoute } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  OK,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContentRequired } from "stoker/openapi/helpers";
import { updateUserPassword } from "../../db/queries";
import { customError, internalServerError } from "../../schemas/response-schemas";
import { updatePasswordSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

const errors = {
  isOauthUser: customError(
    {
      message: "Can't set a password for a user registered with Github.",
      path: ["newpassword"],
    },
    BAD_REQUEST
  ),
  incorrectPassword: customError(
    { message: "The old password is not correct.", path: ["oldpassword"] },
    FORBIDDEN
  ),
};

export const modifyUserPassword = createRoute({
  path: "/password",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(updatePasswordSchema, "The data for the new password."),
  },
  responses: {
    [OK]: okResponse.template,
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(updatePasswordSchema),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
    [BAD_REQUEST]: errors.isOauthUser.template,
    [FORBIDDEN]: errors.incorrectPassword.template,
  },
});

export const modifyUserPasswordHandler: AppRouteHandler<
  typeof modifyUserPassword,
  AppBindingsWithUser
> = async (c) => {
  const { id: userId, hash } = c.var.user;
  const { id: sessionId } = c.var.session!;
  const { newPassword, oldPassword } = c.req.valid("json");
  if (!hash) return c.json(errors.isOauthUser.content, BAD_REQUEST);
  const passIsCorrect = await verifyPasswordHash(hash, oldPassword);
  if (!passIsCorrect) return c.json(errors.incorrectPassword.content, FORBIDDEN);
  const passwordChange = await updateUserPassword(userId, sessionId, newPassword);
  if (!passwordChange) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(okResponse.content, OK);
};
