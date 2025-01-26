import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { CONFLICT, UNAUTHORIZED } from "stoker/http-status-codes";
import db from "../db/dbConfig";
import { sessionsTable, usersTable } from "../db/schema";
import { invalidateSession } from "../lib/auth";
import type { AppContext, AppMiddleware } from "../types/app-bindings";
import { accessDeniedError, alreadyLoggedError } from "../utils/customErrors";
import { entryExists } from "../utils/db-methods";

export const userIsAuthenticated = (c: AppContext) => {
  return !!c.var.user && !!c.var.session;
};

export const protectRoute: AppMiddleware = async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) return await next();
  if (!userIsAuthenticated(c))
    return c.json(accessDeniedError.content, UNAUTHORIZED);
  await next();
};

export const rejectIfAlreadyLogged: AppMiddleware = async (c, next) => {
  if (c.req.path === "/api/auth/logout") return await next();
  if (userIsAuthenticated(c))
    return c.json(alreadyLoggedError.content, CONFLICT);
  await next();
};

export const registerSession: AppMiddleware = async (c, next) => {
  let user = null;
  let session = null;

  const sessionToken = getCookie(c, "session");

  if (sessionToken) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );

    const result = await db
      .select({ user: usersTable, session: sessionsTable })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
      .where(eq(sessionsTable.id, sessionId));

    if (entryExists(result)) {
      user = result[0].user;
      session = result[0].session;

      if (Date.now() >= session.expiresAt.getTime()) {
        await invalidateSession(c, session.id);
        return await next();
      }

      if (
        Date.now() >=
        session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
      ) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
          .update(sessionsTable)
          .set({
            expiresAt: session.expiresAt,
          })
          .where(eq(sessionsTable.id, session.id));
      }
    }
  }

  c.set("session", session);
  c.set("user", user);
  await next();
};
