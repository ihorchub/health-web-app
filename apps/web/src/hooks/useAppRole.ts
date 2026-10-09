import { useMemo } from 'react';

import { useGetAuthMe } from '@/api/auth';
import { usePreviewRole } from '@/hooks/usePreviewRole';
import { useNotifications } from '@/modules/notifications/NotificationsContext';
import { AppRole } from '@/types/role';

const initialsFromName = (firstName: string): string => {
  const trimmed = firstName.trim();
  if (!trimmed) {
    return '?';
  }

  return trimmed.slice(0, 2).toUpperCase();
};

const roleFromMe = (role: 'patient' | 'doctor'): AppRole => {
  return role === 'patient' ? AppRole.PATIENT : AppRole.DOCTOR;
};

/** Session role from GET /auth/me; falls back to PreviewRole for guest QA. */
export const useAppRole = () => {
  const { data: me, isPending, isFetched } = useGetAuthMe();
  const preview = usePreviewRole();
  const { hasUnread } = useNotifications();

  // Only unresolved while we have never settled /auth/me.
  // `me === null` after logout is settled — not loading (avoids blank/guest flashes).
  const isSessionPending = isPending && !isFetched && me === undefined;

  return useMemo(() => {
    if (me) {
      return {
        role: roleFromMe(me.role),
        initials: initialsFromName(me.firstName),
        hasUnreadNotifications: hasUnread,
        me,
        isSession: true as const,
        isLoading: false,
        isSessionPending: false,
        setPreviewRole: preview.setRole,
      };
    }

    return {
      role: preview.role,
      initials: preview.initials,
      hasUnreadNotifications: hasUnread,
      me: null,
      isSession: false as const,
      isLoading: isSessionPending,
      isSessionPending,
      setPreviewRole: preview.setRole,
    };
  }, [hasUnread, isSessionPending, me, preview]);
};
