import { getUserId } from "@/lib/auth";
import { inputErrorResponse, notFoundError } from "@/schemas/response-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchUserProfile } from "../../db/queries";
import { profileSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

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
    [NOT_FOUND]: notFoundError.template,
  },
});

export const getUserProfileHandler: AppRouteHandler<
  typeof getUserProfile,
  AppBindingsWithUser
> = async (c) => {
  const { username } = c.req.valid("param");
  const userId = getUserId(c);
  const profile = await fetchUserProfile(userId, username);
  if (!profile) return c.json(notFoundError.content, NOT_FOUND);
  return c.json(profile, OK);
};
