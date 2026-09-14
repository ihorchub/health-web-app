import { Outlet } from 'react-router-dom';

import { AppHeader, AppShell, Footer } from '@/components/Layout';
import { PreviewRoleProvider } from '@/context/PreviewRoleContext';

/** Route shell — chrome (Header/Footer) via AppShell; role from /auth/me + preview. */
export const PublicLayout = () => {
  return (
    <PreviewRoleProvider>
      <AppShell header={<AppHeader />} footer={<Footer />}>
        <Outlet />
      </AppShell>
    </PreviewRoleProvider>
  );
};
