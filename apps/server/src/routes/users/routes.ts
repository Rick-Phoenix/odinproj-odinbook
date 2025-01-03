import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { insertUserSchema, selectUsersSchema } from "@/db/validationSchemas";
import { httpCodes, notFoundSchema } from "@/lib/constants";

const tags = ["users"];

export const usersList = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [httpCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "Returns all the users"
    ),
    [httpCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUsersSchema),
      "The validation error(s)."
    ),
  },
});

export const getUser = createRoute({
  path: "/users/{username}",
  method: "get",
  tags,
  request: {
    params: selectUsersSchema.pick({ username: true }),
  },
  responses: {
    [httpCodes.OK]: jsonContent(selectUsersSchema, "The selected user."),
    [httpCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectUsersSchema.pick({ username: true })),
      "The validation error(s)."
    ),
    [httpCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "A 'not found' message."
    ),
  },
});

export const usersCreate = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertUserSchema, "The user's data."),
  },
  responses: {
    [httpCodes.OK]: jsonContent(selectUsersSchema, "The newly created user."),
    [httpCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s)."
    ),
  },
});

export type UsersListRoute = typeof usersList;
export type UsersCreateRoute = typeof usersCreate;
export type UserGetRoute = typeof getUser;
