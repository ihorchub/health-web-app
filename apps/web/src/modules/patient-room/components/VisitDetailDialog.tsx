import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

interface VisitDetailDialogProps {
  appointment: CabinetAppointment | null;
  open: boolean;
  onClose: () => void;
}

export const VisitDetailDialog = ({ appointment, open, onClose }: VisitDetailDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);

  if (!appointment) {
    return null;
  }

  const doctor = findMockDoctor(appointment.doctorId);
  const doctorName = doctor
    ? `${doctor.firstName} ${doctor.lastName}`
    : appointment.doctorId;
  const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{doctorName}</DialogTitle>
      <DialogContent>
        <p>
          <strong>{t('cabinet:visitModal.when')}:</strong>{' '}
          {formatTime(appointment.startsAt, i18n.language)}
        </p>
        <p>
          <strong>{t('cabinet:visitModal.place')}:</strong> {t('cabinet:demoClinic')} ·{' '}
          {specialty} · {t(`cabinet:format.${appointment.format}`)}
        </p>
        {appointment.reason ? (
          <p>
            <strong>{t('cabinet:visitModal.reason')}:</strong> {appointment.reason}
          </p>
        ) : null}
        <p>{t(`cabinet:status.${appointment.status}`)}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cabinet:visitModal.close')}</Button>
      </DialogActions>
    </SheetDialog>
  );
};
