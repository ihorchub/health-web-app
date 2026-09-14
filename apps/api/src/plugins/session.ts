import { and, eq, gt } from "drizzle-orm";
import type { FastifyPluginAsync, FastifyReply } from "fastify";

import { config } from "../config.js";
import { getDb } from "../db/client.js";
import { sessions, users } from "../db/schema/index.js";
import { newId } from "../lib/ids.js";
import type { UserRole } from "../lib/redirect.js";

export const SESSION_COOKIE = "medicly_sid";
const SESSION_MS = 14 * 24 * 60 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};

declare module "fastify" {
  interface FastifyRequest {
    sessionUser: SessionUser | null;
  }
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const id = newId("sid");
  const expiresAt = new Date(Date.now() + SESSION_MS);
  await getDb().insert(sessions).values({ id, userId, expiresAt });
  return { id, expiresAt };
}

export async function destroySession(sessionId: string): Promise<void> {
  await getDb().delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionCookie(reply: FastifyReply, sessionId: string, expiresAt: Date): void {
  reply.setCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.nodeEnv === "production",
    path: "/",
    expires: expiresAt,
    signed: true,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE, { path: "/" });
}

export const sessionPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest("sessionUser", null);

  app.addHook("onRequest", async (request) => {
    request.sessionUser = null;
    const raw = request.cookies[SESSION_COOKIE];
    if (!raw) return;

    const unsigned = request.unsignCookie(raw);
    if (!unsigned.valid || !unsigned.value) return;
    const sessionId = unsigned.value;

    const db = getDb();
    const [row] = await db
      .select({
        userId: users.id,
        email: users.email,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (!row) return;

    request.sessionUser = {
      id: row.userId,
      email: row.email,
      role: row.role as UserRole,
    };
  });
};
