import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useGetAuthMe } from '@/api/auth';
import { usePreviewRole } from '@/hooks/usePreviewRole';
import { mockNotificationsForRole } from '@/modules/notifications/fixtures';
import type { AppNotification } from '@/modules/notifications/types';
import { AppRole } from '@/types/role';

interface NotificationsContextValue {
  items: AppNotification[];
  hasUnread: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const roleFromMe = (role: 'patient' | 'doctor'): AppRole =>
  role === 'patient' ? AppRole.PATIENT : AppRole.DOCTOR;

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { data: me } = useGetAuthMe();
  const preview = usePreviewRole();
  const effectiveRole = me ? roleFromMe(me.role) : preview.role;

  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    setItems(mockNotificationsForRole(effectiveRole));
  }, [effectiveRole]);

  const markRead = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setItems([]);
  }, []);

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
