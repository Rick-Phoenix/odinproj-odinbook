import { randomBytes, pbkdf2Sync } from "crypto";

function genPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

  return {
    salt,
    hash,
  };
}

function isPasswordValid(password: string, hash: string, salt: string) {
  const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  const isValid = genHash === hash;

  return isValid;
}

export { genPassword, isPasswordValid };
