import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { CONFLICT, UNAUTHORIZED } from "stoker/http-status-codes";
import { entryExists } from "../db/db-methods";
import db from "../db/dbConfig";
import { sessions, users } from "../db/schema";
import { invalidateSession } from "../lib/auth";
import type { AppContext, AppMiddleware } from "../types/app-bindings";
import { alreadyLoggedError } from "../utils/customErrors";

export const protectRoute: AppMiddleware = async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) return await next();
  const user = await getUser(c);
  if (!user) return c.json("Unauthorized", UNAUTHORIZED);
  c.set("user", user);
  return await next();
};

export const rejectIfAlreadyLogged: AppMiddleware = async (c, next) => {
  if (c.req.path === "/api/auth/logout") return await next();
  if (c.var.user) return c.json(alreadyLoggedError.content, CONFLICT);
  return await next();
};

export const registerUser: AppMiddleware = async (c, next) => {
  const sessionToken = getCookie(c, "session");
  const { user, session } = await fetchUser(sessionToken);

  if (user && session) {
    if (Date.now() >= session.expiresAt.getTime()) {
      await invalidateSession(c, session.id);
      return await next();
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await db
        .update(sessions)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessions.id, session.id));
    }
  }

  c.set("session", session);
  c.set("user", user);
  await next();
};

export async function fetchUser(sessionToken: string | undefined) {
  let user = null;
  let session = null;

  if (sessionToken) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );

    const result = await db
      .select({ user: users, session: sessions })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId));

    if (entryExists(result)) {
      user = result[0].user;
      session = result[0].session;
    }
  }

  return { user, session };
}

export async function getUser(c: AppContext) {
  let userObject = c.var.user;
  if (!userObject) {
    const sessionToken = getCookie(c, "session");
    const { user } = await fetchUser(sessionToken);
    userObject = user;
  }

  return userObject;
}
