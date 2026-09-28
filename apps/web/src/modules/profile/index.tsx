import { useAppRole } from '@/hooks/useAppRole';
import { DoctorProfileView } from '@/modules/profile/components/DoctorProfileView';
import { PatientProfileView } from '@/modules/profile/components/PatientProfileView';
import { AppRole } from '@/types/role';

export const ProfilePage = () => {
  const { role, isLoading, isSession } = useAppRole();

  // Avoid mounting PatientProfileView while /auth/me is still resolving — otherwise a
  // doctor briefly hits GET /patients/me/profile (403).
  if (isLoading && !isSession) {
    return null;
  }

  if (role === AppRole.DOCTOR) {
    return <DoctorProfileView />;
  }

  if (role === AppRole.PATIENT) {
    return <PatientProfileView />;
  }

  return null;
};
