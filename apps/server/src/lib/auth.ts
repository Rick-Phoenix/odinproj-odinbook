import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { webcrypto } from "crypto";
import { eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import db from "../db/dbConfig";
import { sessionsTable } from "../db/schema";
import type { AppContext } from "../types/app-bindings";

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
  await db.insert(sessionsTable).values(session);
  setCookie(c, "session", sessionToken, {
    httpOnly: true,
    sameSite: "Lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function invalidateSession(c: AppContext, sessionId: string) {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
  deleteCookie(c, "session");
}

export const userIsAuthenticated = (c: AppContext) => {
  return !!c.var.user && !!c.var.session;
};
