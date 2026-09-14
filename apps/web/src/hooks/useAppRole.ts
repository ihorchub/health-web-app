import { useMemo } from 'react';

import { useGetAuthMe } from '@/api/auth';
import { usePreviewRole } from '@/hooks/usePreviewRole';
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
  const { data: me, isLoading, isFetching } = useGetAuthMe();
  const preview = usePreviewRole();

  return useMemo(() => {
    if (me) {
      return {
        role: roleFromMe(me.role),
        initials: initialsFromName(me.firstName),
        hasUnreadNotifications: false,
        me,
        isSession: true as const,
        isLoading: isLoading || isFetching,
        setPreviewRole: preview.setRole,
      };
    }

    return {
      role: preview.role,
      initials: preview.initials,
      hasUnreadNotifications: preview.hasUnreadNotifications,
      me: null,
      isSession: false as const,
      isLoading: isLoading || isFetching,
      setPreviewRole: preview.setRole,
    };
  }, [isFetching, isLoading, me, preview]);
};
