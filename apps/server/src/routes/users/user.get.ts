import { createRoute } from "@hono/zod-openapi";
import { asc, desc, eq, gte, sql } from "drizzle-orm";
import { OK, UNAUTHORIZED } from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import db from "../../db/db-config";
import { initialFeedQuery, totalPostsFromUserSubs, userStats } from "../../db/subqueries";
import { accessDeniedError } from "../../schemas/response-schemas";
import { userDataSchema } from "../../schemas/zod-schemas";
import type { AppBindingsWithUser, AppRouteHandler } from "../../types/app-bindings";

const tags = ["users"];

export const user = createRoute({
  path: "/user",
  method: "get",
  tags,
  responses: {
    [OK]: jsonContent(userDataSchema, "The user data."),
    [UNAUTHORIZED]: accessDeniedError.template,
  },
});

export const userHandler: AppRouteHandler<typeof user, AppBindingsWithUser> = async (c) => {
  const { id } = c.var.user;
  const user = await fetchUserData(id);
  return c.json(user, OK, {
    "Cache-Control": "private",
  });
};

async function fetchUserData(userId: string) {
  const totalPostsFromSubs = totalPostsFromUserSubs(userId);
  const userData = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    with: {
      listingsCreated: {
        where: (f, { eq }) => eq(f.sold, false),
        orderBy: (f) => desc(f.createdAt),
      },
      listingsSaved: {
        with: {
          listing: { extras: { isSaved: sql<boolean>`true`.as("isSaved") } },
        },
        orderBy: (f) => desc(f.createdAt),
      },
      ownChats: {
        where: (f) => eq(f.isDeleted, false),
        with: {
          contact: { columns: { username: true, avatarUrl: true, id: true } },
          chat: {
            with: {
              messages: {
                where: (f) =>
                  gte(
                    f.id,
                    sql<number>`
                      (
                        SELECT
                          "firstMessageId"
                        FROM
                          "chatInstances"
                        WHERE
                          "chatInstances"."chatId" = ${f.chatId}
                          AND "chatInstances"."ownerId" = ${userId}
                      )
                    `
                  ),
                orderBy: (f) => asc(f.createdAt),
              },
            },
          },
        },
        columns: { lastRead: true },
      },
    },
    extras: (f) => ({
      totalFeedPosts: sql<number>`${db.$count(totalPostsFromSubs)}::int`
        .mapWith(Number)
        .as("totalFeedPosts"),
      ...initialFeedQuery(userId),
      ...userStats(userId),
      favoriteListingsCategory: sql<string>`
        (
          SELECT
            lis.category
          FROM
            "savedListings" s
            JOIN listings lis ON s."listingId" = lis.id
          WHERE
            s."userId" = ${userId}
          GROUP BY
            lis.category
          ORDER BY
            COUNT(*) DESC
          LIMIT
            1
        )
      `.as("favorite_listings_category"),
    }),
  });

  if (userData)
    return {
      ...userData,
      ownChats: userData.ownChats.map((chat) => ({
        contact: chat.contact,
        ...chat.chat,
        lastRead: chat.lastRead,
      })),
    };

  return userData;
}
