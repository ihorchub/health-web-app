import argon2 from "argon2";

const MIN_LENGTH = 8;

export function validatePassword(password: string): string | null {
  if (password.length < MIN_LENGTH) {
    return "PASSWORD_TOO_SHORT";
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
