import { createRoute, z } from "@hono/zod-openapi";
import { BAD_REQUEST, OK } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { fetchUserProfile } from "../../db/queries";
import type {
  AppBindingsWithUser,
  AppRouteHandler,
} from "../../types/app-bindings";
import { profileSchema } from "../../types/zod-schemas";
import { badRequestError } from "../../utils/customErrors";

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
    [BAD_REQUEST]: badRequestError.template,
  },
});

export const getUserProfileHandler: AppRouteHandler<
  typeof getUserProfile,
  AppBindingsWithUser
> = async (c) => {
  const { username } = c.req.valid("param");
  const profile = await fetchUserProfile(username);
  if (!profile) return c.json(badRequestError.content, BAD_REQUEST);
  return c.json(profile, OK);
};
