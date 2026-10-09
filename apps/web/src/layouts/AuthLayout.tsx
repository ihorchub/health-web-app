import { Outlet } from 'react-router-dom';

import { AppShell } from '@/components/Layout';
import { PreviewRoleProvider } from '@/context/PreviewRoleContext';

/** Auth screens — no global header/footer (pages bring their own chrome). */
export const AuthLayout = () => {
  return (
    <PreviewRoleProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </PreviewRoleProvider>
  );
};
