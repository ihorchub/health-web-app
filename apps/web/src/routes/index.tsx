import { createBrowserRouter } from 'react-router-dom';

import { AuthLayout } from '@/layouts/AuthLayout';
import { ChromeLayout } from '@/layouts/ChromeLayout';
import { LoginPage } from '@/modules/auth/login';
import { SignupPage } from '@/modules/auth/signup';
import { DoctorDayPage } from '@/modules/doctor-day';
import { PatientCabinetPage } from '@/modules/patient-room';
import { ProfilePage } from '@/modules/profile';
import { WorkingHoursPage } from '@/modules/working-hours';
import { LegalDocumentPage } from '@/modules/shared/legal/LegalDocumentPage';
import { DevCheckRoute } from '@/routes/DevCheckRoute';
import { DoctorProfileAccessRoute } from '@/routes/DoctorProfileAccessRoute';
import { HomeRoute } from '@/routes/HomeRoute';
import { AppRoute } from '@/utils/routeUtils/routes';

export const router = createBrowserRouter([
  {
    element: <ChromeLayout />,
    children: [
      {
        path: AppRoute.HOME,
        element: <HomeRoute />,
      },
      {
        path: AppRoute.DOCTOR_PROFILE,
        element: <DoctorProfileAccessRoute />,
      },
      {
        path: AppRoute.DEV,
        element: <DevCheckRoute />,
      },
      {
        path: AppRoute.PRIVACY,
        element: <LegalDocumentPage document="privacy" />,
      },
      {
        path: AppRoute.TERMS,
        element: <LegalDocumentPage document="terms" />,
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
