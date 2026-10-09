import { Navigate } from 'react-router-dom';

import { useAppRole } from '@/hooks/useAppRole';
import { SearchPage } from '@/modules/search';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

/** `/` is guest/patient search (SCR-02). Doctors are sent to their day cabinet. */
export const HomeRoute = () => {
  const { role, isLoading } = useAppRole();

  if (isLoading) {
    return null;
  }

  if (role === AppRole.DOCTOR) {
    return <Navigate to={AppRoute.DOCTOR_DAY} replace />;
  }

  return <SearchPage />;
};
