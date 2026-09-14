import { createContext } from 'react';

import type { AppRole } from '@/types/role';

export interface PreviewRoleContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
  /** Preview stub — real auth later. */
  initials: string;
  hasUnreadNotifications: boolean;
}

export const PreviewRoleContext = createContext<PreviewRoleContextValue | null>(null);
