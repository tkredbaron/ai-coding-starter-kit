// Password hashing + policy + temporary password generation.
import "server-only";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

// 10 rounds: secure and well under the 500 ms login budget on an M4.
const BCRYPT_ROUNDS = 10;

/** Minimum password length per acceptance criteria. */
export const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Unambiguous alphabet (no 0/O, 1/l/I) for in-person handover of temp passwords.
const TEMP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** Generates a readable temporary password (used by admin password reset). */
export function generateTemporaryPassword(length = 12): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += TEMP_ALPHABET[randomInt(TEMP_ALPHABET.length)];
  }
  return out;
}
