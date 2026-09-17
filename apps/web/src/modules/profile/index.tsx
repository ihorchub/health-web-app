import { useAppRole } from '@/hooks/useAppRole';
import { DoctorProfileView } from '@/modules/profile/components/DoctorProfileView';
import { PatientProfileView } from '@/modules/profile/components/PatientProfileView';
import { AppRole } from '@/types/role';

export const ProfilePage = () => {
  const { role } = useAppRole();

  if (role === AppRole.DOCTOR) {
    return <DoctorProfileView />;
  }

  return <PatientProfileView />;
};
