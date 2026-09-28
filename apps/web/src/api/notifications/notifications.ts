import { customInstance } from '@/api/mutator/customInstance';

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
  return customInstance<NotificationsListResponse>({
    url: '/v1/notifications',
    method: 'GET',
  });
};

/** POST /api/v1/notifications/:id/read */
export const postNotificationRead = (id: string) => {
  return customInstance<{ ok: true }>({
    url: `/v1/notifications/${encodeURIComponent(id)}/read`,
    method: 'POST',
  });
};

/** POST /api/v1/notifications/read-all */
export const postNotificationsReadAll = () => {
  return customInstance<{ ok: true }>({
    url: '/v1/notifications/read-all',
    method: 'POST',
  });
};
