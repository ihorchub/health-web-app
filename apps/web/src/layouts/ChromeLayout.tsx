import { Outlet } from 'react-router-dom';

import { AppHeader, AppShell, Footer } from '@/components/Layout';
import { AppPopups } from '@/components/Popups';
import { PreviewRoleProvider } from '@/context/PreviewRoleContext';

/** App chrome: header, footer, popups. */
export const ChromeLayout = () => {
  return (
    <PreviewRoleProvider>
      <AppShell header={<AppHeader />} footer={<Footer />}>
        <Outlet />
      </AppShell>
      <AppPopups />
    </PreviewRoleProvider>
  );
};
