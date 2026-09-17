import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';

export type WorkingHoursModalKind = 'bulk' | 'vacationA' | 'vacationB' | 'saveB' | null;

interface WorkingHoursModalsProps {
  kind: WorkingHoursModalKind;
  zoneBStartLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const WorkingHoursModals = ({
  kind,
  zoneBStartLabel,
  onClose,
  onConfirm,
}: WorkingHoursModalsProps) => {
  const { t } = useTranslation('workingHours');
  const open = kind !== null;

  const title =
    kind === 'bulk'
      ? t('modals.bulkTitle')
      : kind === 'vacationA'
        ? t('modals.vacationATitle')
        : kind === 'vacationB'
          ? t('modals.vacationBTitle')
          : kind === 'saveB'
            ? t('modals.saveBTitle')
            : '';

  const body =
    kind === 'bulk'
      ? t('modals.bulkBody')
      : kind === 'vacationA'
        ? t('modals.vacationABody')
        : kind === 'vacationB'
          ? t('modals.vacationBBody')
          : kind === 'saveB'
            ? t('modals.saveBBody', { date: zoneBStartLabel })
            : '';

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('modals.cancel')}</Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          {t('modals.confirm')}
        </Button>
      </DialogActions>
    </SheetDialog>
  );
};
