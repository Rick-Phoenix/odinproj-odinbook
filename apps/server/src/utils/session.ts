import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { webcrypto } from "crypto";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import db from "../db/dbConfig";
import { sessionTable, userTable } from "../db/schema";
import type { AppContext, AppMiddleware } from "../types/app-bindings";
import { entryExists } from "./db-methods";

export async function createSession(c: AppContext, userId: string) {
  const sessionToken = webcrypto.randomUUID();
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const session = {
    id: sessionId,
    userId,
    expiresAt,
  };
  await db.insert(sessionTable).values(session);
  setCookie(c, "session", sessionToken, {
    httpOnly: true,
    sameSite: "Lax",
    expires: expiresAt,
    path: "/",
  });
}

export const registerSession: AppMiddleware = async (c, next) => {
  let user = null;
  let session = null;

  const sessionToken = getCookie(c, "session");

  if (sessionToken) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );

    const result = await db
      .select({ user: userTable, session: sessionTable })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.id, sessionId));

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
          .update(sessionTable)
          .set({
            expiresAt: session.expiresAt,
          })
          .where(eq(sessionTable.id, session.id));
      }
    }
  }

  c.set("session", session);
  c.set("user", user);
  await next();
};

export async function invalidateSession(c: AppContext, sessionId: string) {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
  deleteCookie(c, "session");
}

export const userIsAuthenticated = (c: AppContext) => {
  return !!c.var.user && !!c.var.session;
};
