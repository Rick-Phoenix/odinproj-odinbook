import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { CONFLICT, UNAUTHORIZED } from "stoker/http-status-codes";
import db from "../db/db-config";
import { entryExists } from "../db/db-methods";
import { sessions, users } from "../db/schema";
import { invalidateSession } from "../lib/auth";
import { redis } from "../redis/redis-config";
import { alreadyLoggedError } from "../schemas/response-schemas";
import type { AppContext, AppMiddleware } from "../types/app-bindings";
import type { Session, User } from "../types/db-items";

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

export const registerSession: AppMiddleware = async (c, next) => {
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

      redis
        .hset(`session:${session.id}`, "expiresAt", session.expiresAt as unknown as string)
        .catch((e) => console.error(`Redis Error: ${e}`));
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
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
    const redisSession = await redis.hgetall(`session:${sessionId}`);
    if ("expiresAt" in redisSession)
      session = {
        ...redisSession,
        expiresAt: new Date(redisSession.expiresAt),
      } as unknown as Session;
    const redisUser = await redis.hgetall(`user:${session?.userId}`);
    if ("username" in redisUser) {
      user = Object.fromEntries(
        Object.entries(redisUser).map(([key, value]) => [key, value.length === 0 ? null : value])
      ) as User;
    }

    if (!user || !session) {
      const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId));

      if (entryExists(result)) {
        user = result[0].user;
        session = result[0].session;

        const pipeline = redis.pipeline();
        pipeline.hset(`user:${user.id}`, user);
        pipeline.hset(`session:${session.id}`, session);
        pipeline.exec().catch((e) => console.error(e));
      }
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
