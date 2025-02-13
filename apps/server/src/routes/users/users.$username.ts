import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchUserProfile } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { profileSchema } from "../../types/zod-schemas";
import { internalServerError } from "../../utils/customErrors";
import { getUserId } from "../../utils/getters";

const tags = ["users"];

export const getUserProfile = createRoute({
  path: "/{username}",
  method: "get",
  tags,
  request: {
    params: z.object({
      username: z.string(),
    }),
  },
  responses: {
    [OK]: jsonContent(profileSchema, "The user's profile."),
    [BAD_REQUEST]: internalServerError.template,
  },
});

export const getUserProfileHandler: AppRouteHandler<
  typeof getUserProfile,
  AppBindingsWithUser
> = async (c) => {
  const { username } = c.req.valid("param");
  const userId = getUserId(c);
  const profile = await fetchUserProfile(userId, username);
  if (!profile) return c.json(internalServerError.content, BAD_REQUEST);
  return c.json(profile, OK);
};
