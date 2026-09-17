import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  DangerOutlineButton,
  FormatChip,
  OutlineButton,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import {
  formatCabinetHeaderDate,
  formatTime,
} from '@/modules/patient-room/utils/formatCabinetDate';

const DialogBody = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Intro = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 14,
  lineHeight: '22px',
  color: theme.palette.text.secondary,
}));

const CompareGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

const TimeCard = styled('div')<{ $highlight?: boolean }>(({ theme, $highlight }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  border: `1px solid ${$highlight ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $highlight
    ? theme.palette.mode === 'light'
      ? 'rgba(46, 177, 145, 0.08)'
      : theme.palette.action.selected
    : theme.palette.background.paper,
}));

const CardLabel = styled('span')(({ theme }) => ({
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

const CardWhen = styled('strong')(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.primary,
}));

const MetaLine = styled('span')(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.secondary,
}));

const ActionsColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface ReschedulePendingDialogProps {
  appointment: CabinetAppointment | null;
  open: boolean;
  onClose: () => void;
  onAccept: (appointment: CabinetAppointment) => void;
  onPickAnother: (appointment: CabinetAppointment) => void;
  onCancelVisit: (appointment: CabinetAppointment) => void;
}

export const ReschedulePendingDialog = ({
  appointment,
  open,
  onClose,
  onAccept,
  onPickAnother,
  onCancelVisit,
}: ReschedulePendingDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);

  if (!appointment || !appointment.proposedStartsAt) {
    return null;
  }

  const doctor = findMockDoctor(appointment.doctorId);
  const doctorName = doctor
    ? `${doctor.firstName} ${doctor.lastName}`
    : appointment.doctorId;
  const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';
  const clinicLabel = t('cabinet:demoClinic');

  const formatWhen = (iso: string) =>
    `${formatCabinetHeaderDate(new Date(iso), i18n.language)}, ${formatTime(iso, i18n.language)}`;

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('cabinet:pendingDecision.title')}</DialogTitle>
      <DialogBody>
        <Intro>{t('cabinet:pendingDecision.intro')}</Intro>
        <MetaLine>
          {doctorName} · {specialty} · {clinicLabel}
        </MetaLine>
        <FormatChip>{t(`cabinet:format.${appointment.format}`)}</FormatChip>

        <CompareGrid>
          <TimeCard>
            <CardLabel>{t('cabinet:pendingDecision.original')}</CardLabel>
            <CardWhen>{formatWhen(appointment.startsAt)}</CardWhen>
            <MetaLine>{t('cabinet:pendingDecision.originalHint')}</MetaLine>
          </TimeCard>
          <TimeCard $highlight>
            <CardLabel>{t('cabinet:pendingDecision.proposed')}</CardLabel>
            <CardWhen>{formatWhen(appointment.proposedStartsAt)}</CardWhen>
            <MetaLine>{t('cabinet:pendingDecision.proposedHint')}</MetaLine>
          </TimeCard>
        </CompareGrid>
      </DialogBody>
      <DialogActions>
        <ActionsColumn>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              onAccept(appointment);
            }}
          >
            {t('cabinet:pendingDecision.accept')}
          </Button>
          <OutlineButton
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={() => {
              onPickAnother(appointment);
            }}
          >
            {t('cabinet:pendingDecision.pickAnother')}
          </OutlineButton>
          <DangerOutlineButton
            variant="outlined"
            fullWidth
            onClick={() => {
              onCancelVisit(appointment);
            }}
          >
            {t('cabinet:pendingDecision.cancelVisit')}
          </DangerOutlineButton>
          <Button onClick={onClose}>{t('cabinet:pendingDecision.close')}</Button>
        </ActionsColumn>
      </DialogActions>
    </SheetDialog>
  );
};
