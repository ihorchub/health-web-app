import {
  getNotifications as generatedGetNotifications,
  postNotificationRead as generatedPostNotificationRead,
  postNotificationsReadAll as generatedPostNotificationsReadAll,
} from '@/api/generated/notifications/notifications';

/** Live API notification types (SCR-10). */
export type ApiNotificationType =
  | 'appointment_booked'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'reschedule_proposed'
  | 'proposal_accepted';

export interface ApiNotificationItem {
  id: string;
  type: string;
  createdAt: string;
  read: false;
  payload: Record<string, unknown>;
}

export interface NotificationsListResponse {
  unreadCount: number;
  items: ApiNotificationItem[];
}

/** GET /api/v1/notifications */
export const getNotifications = () => {
  return generatedGetNotifications() as Promise<NotificationsListResponse>;
};

/** POST /api/v1/notifications/:id/read */
export const postNotificationRead = (id: string) => {
  return generatedPostNotificationRead(id) as Promise<{ ok: true }>;
};

/** POST /api/v1/notifications/read-all */
export const postNotificationsReadAll = () => {
  return generatedPostNotificationsReadAll() as Promise<{ ok: true }>;
};
