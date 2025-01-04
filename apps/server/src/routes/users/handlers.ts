import db from "@/db/index.js";
import { user } from "@/db/schema.js";
import { lowercase } from "../../utils/db-methods.js";
import { httpCodes } from "@/lib/constants.js";
import type { AppRouteHandler } from "@/types/app-bindings.js";
import type {
  UserGetRoute,
  // UsersCreateRoute,
  UsersListRoute,
} from "./routes.js";

export const usersListHandler: AppRouteHandler<UsersListRoute> = async (c) => {
  const user = await db.query.user.findMany();
  return c.json(user, httpCodes.OK);
};

// export const usersCreateHandler: AppRouteHandler<UsersCreateRoute> = async (
//   c
// ) => {
//   const { name } = c.req.valid("json");
//   const [entry] = await db.insert(user).values({ name, email }).returning();
//   return c.json(entry, httpCodes.OK);
// };

export const getUserHandler: AppRouteHandler<UserGetRoute> = async (c) => {
  const { name } = c.req.valid("param");
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(lowercase(user.name), name.toLocaleLowerCase()),
  });
  if (!user)
    return c.json(
      {
        message: "User not found.",
      },

      httpCodes.NOT_FOUND
    );
  return c.json(user, httpCodes.OK);
};
