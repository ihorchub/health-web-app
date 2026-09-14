import { randomBytes } from "node:crypto";

export function newId(prefix?: string): string {
  const id = randomBytes(12).toString("base64url");
  return prefix ? `${prefix}_${id}` : id;
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}
