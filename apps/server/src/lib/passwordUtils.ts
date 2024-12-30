import { randomBytes, pbkdf2Sync } from "crypto";

type Credentials = {
  password: string;
  hash: string;
  salt: string;
};
function genPassword(password: string): { salt: string; hash: string } {
  const salt = randomBytes(32).toString("hex");
  const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );

  return {
    salt,
    hash: genHash,
  };
}
function isPasswordValid({ password, hash, salt }: Credentials): boolean {
  const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  const isValid = genHash === hash;

  return isValid;
}
export { genPassword, isPasswordValid };
