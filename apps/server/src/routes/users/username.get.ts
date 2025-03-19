import { createRoute, z } from "@hono/zod-openapi";
import { and, desc, ne, sql } from "drizzle-orm";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { lowercase } from "../../db/db-methods";
import { isSaved } from "../../db/subqueries";
import { getUserId } from "../../lib/auth";
import { inputErrorResponse, notFoundError } from "../../schemas/response-schemas";
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
  return c.json(profile, OK, {
    "Cache-Control": "public, max-age=180",
  });
};

async function fetchUserProfile(userId: string, username: string) {
  const profile = await db.query.users.findFirst({
    where(user, { eq }) {
      return and(
        eq(lowercase(user.username), username.toLocaleLowerCase()),
        ne(user.id, "deleted")
      );
    },
    columns: {
      avatarUrl: true,
      username: true,
      createdAt: true,
      status: true,
      id: true,
    },
    with: {
      comments: {
        with: {
          post: {
            columns: { title: true, id: true },
            with: { room: { columns: { name: true } } },
          },
        },
      },
      posts: {
        columns: { text: true, title: true, id: true, createdAt: true },
        with: { room: { columns: { name: true } } },
      },
      listingsCreated: {
        extras: (f) => ({
          ...isSaved(userId, f.id),
          seller: sql<string>`${username}::text`.as("seller"),
        }),
        orderBy: (f) => desc(f.createdAt),
      },
      roomSubscriptions: true,
    },
  });

  return profile;
}
