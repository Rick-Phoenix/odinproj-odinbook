import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { webcrypto } from "crypto";
import { eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import db from "../db/db-config";
import { sessions } from "../db/schema";
import type { AppContext, AppContextWithUser } from "../types/app-bindings";

export async function createSession(c: AppContext, userId: string) {
  const sessionToken = webcrypto.randomUUID();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const session = {
    id: sessionId,
    userId,
    expiresAt,
  };

  await db.insert(sessions).values(session);
  setCookie(c, "session", sessionToken, {
    httpOnly: true,
    sameSite: "Lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function invalidateSession(c: AppContext, sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  deleteCookie(c, "session");
}
export function getUserId(c: AppContextWithUser) {
  return c.var.user.id;
}

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
  });
}

export async function verifyPasswordHash(hash: string, password: string) {
  return await verify(hash, password);
}
