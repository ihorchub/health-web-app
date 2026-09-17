import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import { MOCK_PROPOSE_SLOTS } from '@/modules/doctor-day/fixtures';
import type { DoctorDayVisit } from '@/modules/doctor-day/types';
import { SlotChip, SlotPicker } from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

const DialogBody = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

interface ProposeTimeDialogProps {
  visit: DoctorDayVisit | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (slot: string) => void;
}

export const ProposeTimeDialog = ({ visit, open, onClose, onSubmit }: ProposeTimeDialogProps) => {
  const { t } = useTranslation('doctorDay');
  const [slot, setSlot] = useState(MOCK_PROPOSE_SLOTS[0] ?? '12:00');

  if (!visit) {
    return null;
  }

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('modals.proposeTitle')}</DialogTitle>
      <DialogBody>
        <p>{t('modals.proposeBody', { patient: visit.patientName })}</p>
        <SlotPicker>
          {MOCK_PROPOSE_SLOTS.map((value) => (
            <SlotChip
              key={value}
              type="button"
              $active={slot === value}
              onClick={() => {
                setSlot(value);
              }}
            >
              {value}
            </SlotChip>
          ))}
        </SlotPicker>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose}>{t('modals.close')}</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit(slot);
            onClose();
          }}
        >
          {t('modals.submit')}
        </Button>
      </DialogActions>
    </SheetDialog>
  );
};

interface VisitCardDialogProps {
  visit: DoctorDayVisit | null;
  open: boolean;
  onClose: () => void;
}

export const VisitCardDialog = ({ visit, open, onClose }: VisitCardDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  if (!visit) {
    return null;
  }

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('modals.visitCardTitle')}</DialogTitle>
      <DialogContent>
        <p>{visit.patientName}</p>
        <p>{formatTime(visit.startsAt, i18n.language)}</p>
        <p>{t(`status.${visit.status}`)}</p>
        {visit.reason ? <p>{visit.reason}</p> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('modals.close')}</Button>
      </DialogActions>
    </SheetDialog>
  );
};

interface DayScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  visits: DoctorDayVisit[];
}

export const DayScheduleDialog = ({ open, onClose, visits }: DayScheduleDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('modals.dayScheduleTitle')}</DialogTitle>
      <DialogContent>
        <ul>
          {visits.map((visit) => (
            <li key={visit.id}>
              {formatTime(visit.startsAt, i18n.language)} — {visit.patientName} (
              {t(`status.${visit.status}`)})
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('modals.close')}</Button>
      </DialogActions>
    </SheetDialog>
  );
};
