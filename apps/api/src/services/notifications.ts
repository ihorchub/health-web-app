import { and, desc, eq, isNull } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { notifications } from "../db/schema/notifications.js";
import { ApiError } from "../lib/errors.js";
import { newId } from "../lib/ids.js";

export type NotificationRecord = {
  id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
};

export async function createNotification(input: {
  userId: string;
  type: string;
  payload?: Record<string, unknown>;
}): Promise<NotificationRecord> {
  const id = newId("ntf");
  await getDb()
    .insert(notifications)
    .values({
      id,
      userId: input.userId,
      type: input.type,
      payload: input.payload ?? {},
    });
  const [row] = await getDb().select().from(notifications).where(eq(notifications.id, id)).limit(1);
  return row as NotificationRecord;
}

export async function listUnread(userId: string): Promise<{
  unreadCount: number;
  items: Array<{
    id: string;
    type: string;
    createdAt: string;
    read: false;
    payload: Record<string, unknown>;
  }>;
}> {
  const rows = await getDb()
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
    .orderBy(desc(notifications.createdAt));

  const items = rows.map((row) => ({
    id: row.id,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    read: false as const,
    payload: (row.payload ?? {}) as Record<string, unknown>,
  }));

  return { unreadCount: items.length, items };
}

export async function markRead(userId: string, notificationId: string): Promise<{ ok: true }> {
  const [row] = await getDb()
    .select()
    .from(notifications)
    .where(eq(notifications.id, notificationId))
    .limit(1);

  if (!row) throw new ApiError("NOTIFICATION_NOT_FOUND", 404);
  if (row.userId !== userId) throw new ApiError("NOTIFICATION_FORBIDDEN", 403);

  if (!row.readAt) {
    await getDb()
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, notificationId));
  }

  return { ok: true };
}

export async function markAllRead(userId: string): Promise<{ ok: true }> {
  await getDb()
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return { ok: true };
}
