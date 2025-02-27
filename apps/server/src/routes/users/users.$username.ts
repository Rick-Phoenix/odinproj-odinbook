import { createRoute, z } from "@hono/zod-openapi";
import { INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchUserProfile } from "../../db/queries";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";
import { profileSchema } from "../../types/zod-schemas";
import { getUserId } from "../../utils/getters";
import { inputErrorResponse } from "../../utils/inputErrorResponse";
import { internalServerError } from "../../utils/response-schemas";

const tags = ["users"];

const inputs = z.object({
  username: z.string(),
});

export const getUserProfile = createRoute({
  path: "/{username}",
  method: "get",
  tags,
  request: {
    params: inputs,
  },
  responses: {
    [OK]: jsonContent(profileSchema, "The user's profile."),
    [UNPROCESSABLE_ENTITY]: inputErrorResponse(inputs),
    [INTERNAL_SERVER_ERROR]: internalServerError.template,
  },
});

export const getUserProfileHandler: AppRouteHandler<
  typeof getUserProfile,
  AppBindingsWithUser
> = async (c) => {
  const { username } = c.req.valid("param");
  const userId = getUserId(c);
  const profile = await fetchUserProfile(userId, username);
  if (!profile) return c.json(internalServerError.content, INTERNAL_SERVER_ERROR);
  return c.json(profile, OK);
};
