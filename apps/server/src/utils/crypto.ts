import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import db from "../db/dbConfig";
import { sessionTable } from "../db/schema";
import { webcrypto } from "crypto";

export async function createSession(userId: string) {
  const sessionToken = webcrypto.randomUUID();
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
  };
  await db.insert(sessionTable).values(session);
  return session;
}
