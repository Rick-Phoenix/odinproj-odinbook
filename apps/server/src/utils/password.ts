import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string) {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
  });
}

export async function verifyPasswordHash(hash: string, password: string) {
  return await verify(hash, password);
}
