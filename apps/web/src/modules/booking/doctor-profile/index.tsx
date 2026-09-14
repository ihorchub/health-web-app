import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { usePopups } from '@/hooks/usePopups';
import { SearchPage } from '@/modules/search';
import { Popups } from '@/utils/popupUtils/popupTypes';

/** SCR-03 route — keeps SCR-02 under the scrim and opens the profile wizard step. */
export const DoctorProfileRoute = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { updatePopup } = usePopups();

  useEffect(() => {
    if (!doctorId) {
      return;
    }
    updatePopup(Popups.DOCTOR_PROFILE, true, { doctorId });
  }, [doctorId, updatePopup]);

  return <SearchPage />;
};

export { DoctorProfilePopup } from '@/modules/booking/doctor-profile/DoctorProfilePopup';
