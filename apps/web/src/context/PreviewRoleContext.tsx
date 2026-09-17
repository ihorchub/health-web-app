import { useMemo, useState, type ReactNode } from 'react';

import { PreviewRoleContext } from '@/context/previewRoleContextInstance';
import { NotificationsProvider } from '@/modules/notifications/NotificationsContext';
import { AppRole } from '@/types/role';

interface PreviewRoleProviderProps {
  children: ReactNode;
  initialRole?: AppRole;
}

const roleInitials: Record<AppRole, string> = {
  [AppRole.GUEST]: '',
  [AppRole.PATIENT]: 'ОП',
  [AppRole.DOCTOR]: 'ДЛ',
};

/** Stub role for chrome preview until real auth exists. */
export const PreviewRoleProvider = ({
  children,
  initialRole = AppRole.GUEST,
}: PreviewRoleProviderProps) => {
  const [role, setRole] = useState<AppRole>(initialRole);

  const value = useMemo(
    () => ({
      role,
      setRole,
      initials: roleInitials[role],
    }),
    [role],
  );

  return (
    <PreviewRoleContext.Provider value={value}>
      <NotificationsProvider>{children}</NotificationsProvider>
    </PreviewRoleContext.Provider>
  );
};
