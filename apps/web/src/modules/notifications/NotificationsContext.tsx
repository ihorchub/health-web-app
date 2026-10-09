import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { useGetAuthMe } from '@/api/auth';
import {
  type ApiNotificationItem,
  useGetNotifications,
  usePostNotificationRead,
  usePostNotificationsReadAll,
} from '@/api/notifications';
import type { AppNotification, NotificationEventType } from '@/modules/notifications/types';

interface NotificationsContextValue {
  items: AppNotification[];
  hasUnread: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const FE_TYPES = new Set<NotificationEventType>([
  'patient_booked',
  'patient_cancelled',
  'patient_rescheduled',
  'patient_accepted_proposal',
  'patient_picked_other_slot',
  'doctor_cancelled',
  'doctor_proposed_time',
  'proposal_expired',
]);

const isNotificationEventType = (value: string): value is NotificationEventType =>
  (FE_TYPES as ReadonlySet<string>).has(value);

const payloadString = (payload: Record<string, unknown>, key: string): string => {
  const value = payload[key];
  return typeof value === 'string' ? value : '';
};

const mapApiNotification = (item: ApiNotificationItem): AppNotification | null => {
  const payload = item.payload ?? {};
  const cancelledBy = payload.cancelledBy;

  let type: NotificationEventType | null = null;
  switch (item.type) {
    case 'appointment_booked':
      type = 'patient_booked';
      break;
    case 'appointment_cancelled':
      type = cancelledBy === 'doctor' ? 'doctor_cancelled' : 'patient_cancelled';
      break;
    case 'appointment_rescheduled':
      type = 'patient_rescheduled';
      break;
    case 'reschedule_proposed':
      type = 'doctor_proposed_time';
      break;
    case 'proposal_accepted':
      type = 'patient_accepted_proposal';
      break;
    case 'proposal_expired':
      type = 'proposal_expired';
      break;
    default:
      if (isNotificationEventType(item.type)) {
        type = item.type;
      }
      break;
  }

  if (!type) {
    return null;
  }

  const visitAt =
    payloadString(payload, 'proposedStartAt') ||
    payloadString(payload, 'visitAt') ||
    payloadString(payload, 'startAt') ||
    undefined;

  return {
    id: item.id,
    type,
    createdAt: item.createdAt,
    patientName: payloadString(payload, 'patientName') || undefined,
    doctorName: payloadString(payload, 'doctorName') || undefined,
    visitAt: visitAt || undefined,
    appointmentId:
      payloadString(payload, 'appointmentId') ||
      payloadString(payload, 'newAppointmentId') ||
      undefined,
  };
};

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { data: me } = useGetAuthMe();
  const isLoggedIn = Boolean(me);

  const notificationsQuery = useGetNotifications({ enabled: isLoggedIn });
  const readMutation = usePostNotificationRead();
  const readAllMutation = usePostNotificationsReadAll();

  const items = useMemo(() => {
    if (!isLoggedIn) {
      return [] as AppNotification[];
    }
    return (notificationsQuery.data?.items ?? [])
      .map(mapApiNotification)
      .filter((item): item is AppNotification => item !== null);
  }, [isLoggedIn, notificationsQuery.data?.items]);

  const markRead = useCallback(
    (id: string) => {
      if (!isLoggedIn) {
        return;
      }
      readMutation.mutate({ id });
    },
    [isLoggedIn, readMutation],
  );

  const markAllRead = useCallback(() => {
    if (!isLoggedIn) {
      return;
    }
    readAllMutation.mutate();
  }, [isLoggedIn, readAllMutation],
  );

  const value = useMemo(
    () => ({
      items,
      hasUnread: items.length > 0,
      markRead,
      markAllRead,
    }),
    [items, markAllRead, markRead],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return ctx;
};
