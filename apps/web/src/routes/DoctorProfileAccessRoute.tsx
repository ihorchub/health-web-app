import { Navigate } from 'react-router-dom';

import { useAppRole } from '@/hooks/useAppRole';
import { DoctorProfileRoute } from '@/modules/booking/doctor-profile';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

/** Doctor profile / booking wizard is patient+guest only. */
export const DoctorProfileAccessRoute = () => {
  const { role, isLoading } = useAppRole();

  if (isLoading) {
    return null;
  }

  if (role === AppRole.DOCTOR) {
    return <Navigate to={AppRoute.DOCTOR_DAY} replace />;
  }

  return <DoctorProfileRoute />;
};
