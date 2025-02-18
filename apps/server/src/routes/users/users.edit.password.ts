import { createRoute, z } from "@hono/zod-openapi";
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { updateUserPassword } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { updatePasswordSchema } from "../../types/zod-schemas";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { verifyPasswordHash } from "../../utils/password";
import {
  accessDeniedError,
  customError,
  internalServerError,
} from "../../utils/response-schemas";

const tags = ["users"];

const errors = {
  isOauthUser: customError(
    {
      message:
        "Can't set a password for a user registered with a third party app.",
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
  path: "/edit/password",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      updatePasswordSchema,
      "The data for the new password."
    ),
  },
  responses: {
    [OK]: jsonContent(z.string(), "A confirmation message."),
    [UNAUTHORIZED]: accessDeniedError.template,
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
  if (!passIsCorrect)
    return c.json(errors.incorrectPassword.content, FORBIDDEN);
  const passwordChange = await updateUserPassword(
    userId,
    sessionId,
    newPassword
  );
  if (!passwordChange)
    return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json("OK", OK);
};
