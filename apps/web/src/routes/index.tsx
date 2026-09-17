import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AppHeader, AppShell, Footer } from '@/components/Layout';
import { AppPopups } from '@/components/Popups';
import { PreviewRoleProvider } from '@/context/PreviewRoleContext';
import { LoginPage } from '@/modules/auth/login';
import { SignupPage } from '@/modules/auth/signup';
import { DoctorProfileRoute } from '@/modules/booking/doctor-profile';
import { DoctorDayPage } from '@/modules/doctor-day';
import { PatientCabinetPage } from '@/modules/patient-room';
import { ProfilePage } from '@/modules/profile';
import { WorkingHoursPage } from '@/modules/working-hours';
import { SearchPage } from '@/modules/search';
import { LegalPlaceholderPage } from '@/modules/shared/legal/LegalPlaceholderPage';
import { DevCheckRoute } from '@/routes/DevCheckRoute';
import { AppRoute } from '@/utils/routeUtils/routes';

const ChromeLayout = () => {
  return (
    <PreviewRoleProvider>
      <AppShell header={<AppHeader />} footer={<Footer />}>
        <Outlet />
      </AppShell>
      <AppPopups />
    </PreviewRoleProvider>
  );
};

const AuthLayout = () => {
  return (
    <PreviewRoleProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </PreviewRoleProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <ChromeLayout />,
    children: [
      {
        path: AppRoute.HOME,
        element: <SearchPage />,
      },
      {
        path: AppRoute.DOCTOR_PROFILE,
        element: <DoctorProfileRoute />,
      },
      {
        path: AppRoute.DEV,
        element: <DevCheckRoute />,
      },
      {
        path: AppRoute.PRIVACY,
        element: <LegalPlaceholderPage titleKey="footer.privacy" />,
      },
      {
        path: AppRoute.TERMS,
        element: <LegalPlaceholderPage titleKey="footer.terms" />,
      },
      {
        path: AppRoute.APPOINTMENTS,
        element: <PatientCabinetPage />,
      },
      {
        path: AppRoute.DOCTOR_DAY,
        element: <DoctorDayPage />,
      },
      {
        path: AppRoute.DOCTOR_HOURS,
        element: <WorkingHoursPage />,
      },
      {
        path: AppRoute.PROFILE,
        element: <ProfilePage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: AppRoute.LOGIN,
        element: <LoginPage />,
      },
      {
        path: AppRoute.SIGNUP,
        element: <SignupPage />,
      },
    ],
  },
]);
