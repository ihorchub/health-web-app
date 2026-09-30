import { Button } from '@mui/material';
import { styled } from '@/theme/styled';

import { IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import type { DoctorDayVisit } from '@/modules/doctor-day/types';
import { DEMO_DOCTOR_DAY } from '@/modules/doctor-day/utils/mapDashboard';
import {
  DangerOutlineButton,
  MetaChip,
  ModalCloseButton,
  ModalHeaderRow,
  ModalOverline,
  ModalPaper,
  ModalSubtitle,
  ModalTitle,
  ModalTitleBlock,
  ScheduleChevron,
  ScheduleSlotMain,
  ScheduleSlotMeta,
  ScheduleSlotName,
  ScheduleSlotRow,
  ScheduleSlotTime,
  SoftStatusPill,
  VisitCardActions,
  VisitCardBody,
  VisitCardContact,
  VisitCardChips,
  VisitCardDuration,
  VisitCardHeader,
  VisitCardMain,
  VisitCardName,
  VisitCardNameRow,
  VisitCardReason,
  VisitCardShell,
  VisitCardTime,
  VisitCardTimeCol,
} from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

const ScheduleDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 700,
    width: '100%',
    borderRadius: 20,
    padding: theme.spacing(2.5, 2),
    boxShadow: '0 16px 48px rgba(22, 62, 82, 0.14)',
    boxSizing: 'border-box',

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3.5),
    },

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
    },
  },
}));

const VisitDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 600,
    width: '100%',
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(22, 62, 82, 0.14)',

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      margin: 0,
      maxHeight: '100dvh',
      height: 'auto',
    },
  },
}));

const softTone = (
  status: DoctorDayVisit['status'],
): 'accent' | 'error' | 'muted' => {
  if (status === 'cancelled') {
    return 'error';
  }
  if (status === 'completed' || status === 'rescheduled') {
    return 'muted';
  }
  return 'accent';
};

const scheduleVariant = (
  status: DoctorDayVisit['status'],
): 'booked' | 'cancelled' => {
  if (status === 'cancelled') {
    return 'cancelled';
  }
  return 'booked';
};

const formatShortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

const formatDayHeading = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

interface VisitCardDialogProps {
  visit: DoctorDayVisit | null;
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const VisitCardDialog = ({
  visit,
  open,
  onClose,
  onComplete,
  onCancel,
}: VisitCardDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  if (!visit) {
    return null;
  }

  const canAct = visit.status === 'upcoming';
  const contactParts = [
    visit.phone ? t('modals.phone', { value: visit.phone }) : null,
    visit.email ? t('modals.email', { value: visit.email }) : null,
  ].filter(Boolean);

  return (
    <VisitDialog open={open} onClose={onClose} fullWidth>
      <VisitCardShell>
        <VisitCardHeader>
          <ModalOverline>{t('modals.visitCardTitle')}</ModalOverline>
          <ModalCloseButton type="button" aria-label={t('modals.close')} onClick={onClose}>
            <IconX size={14} stroke={1.75} />
          </ModalCloseButton>
        </VisitCardHeader>

        <VisitCardBody>
          <VisitCardTimeCol>
            <VisitCardTime>{formatTime(visit.startsAt, i18n.language)}</VisitCardTime>
            <VisitCardDuration>
              {t('nextVisit.durationMin', { minutes: visit.durationMinutes })}
            </VisitCardDuration>
          </VisitCardTimeCol>

          <VisitCardMain>
            <VisitCardNameRow>
              <VisitCardName>{visit.patientName}</VisitCardName>
              <SoftStatusPill $tone={softTone(visit.status)}>
                {t(`status.${visit.status}`)}
              </SoftStatusPill>
            </VisitCardNameRow>

            <VisitCardChips>
              <MetaChip>{t(`format.${visit.format}`)}</MetaChip>
              <MetaChip>{formatShortDate(visit.startsAt, i18n.language)}</MetaChip>
            </VisitCardChips>

            {visit.reason ? (
              <VisitCardReason>{t('list.reason', { reason: visit.reason })}</VisitCardReason>
            ) : null}

            {contactParts.length > 0 ? (
              <VisitCardContact>{contactParts.join(' · ')}</VisitCardContact>
            ) : null}
          </VisitCardMain>
        </VisitCardBody>

        {canAct ? (
          <VisitCardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onComplete?.();
                onClose();
              }}
            >
              {t('nextVisit.complete')}
            </Button>
            <DangerOutlineButton
              variant="outlined"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {t('nextVisit.cancel')}
            </DangerOutlineButton>
          </VisitCardActions>
        ) : null}
      </VisitCardShell>
    </VisitDialog>
  );
};

interface DayScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  visits: DoctorDayVisit[];
  /** Individual free slot start times (ISO) for today. */
  freeSlotIsos: string[];
  onOpenVisit: (visit: DoctorDayVisit) => void;
}

export const DayScheduleDialog = ({
  open,
  onClose,
  visits,
  freeSlotIsos,
  onOpenVisit,
}: DayScheduleDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  const orderedVisits = useMemo(
    () => [...visits].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [visits],
  );

  return (
    <ScheduleDialog open={open} onClose={onClose} fullWidth>
      <ModalPaper>
        <ModalHeaderRow>
          <ModalTitleBlock>
            <ModalTitle>{formatDayHeading(DEMO_DOCTOR_DAY, i18n.language)}</ModalTitle>
            <ModalSubtitle>
              {t('modals.dayScheduleMeta', {
                visits: orderedVisits.length,
                free: freeSlotIsos.length,
              })}
            </ModalSubtitle>
          </ModalTitleBlock>
          <ModalCloseButton type="button" aria-label={t('modals.close')} onClick={onClose}>
            <IconX size={14} stroke={1.75} />
          </ModalCloseButton>
        </ModalHeaderRow>

        {orderedVisits.map((visit) => {
          const variant = scheduleVariant(visit.status);
          const meta =
            visit.status === 'cancelled' && visit.cancelledBy
              ? visit.cancelledBy === 'patient'
                ? t('list.cancelledByPatient')
                : t('list.cancelledByDoctor')
              : [t(`format.${visit.format}`), visit.reason].filter(Boolean).join(' · ');

          return (
            <ScheduleSlotRow
              key={visit.id}
              type="button"
              $variant={variant}
              onClick={() => {
                onClose();
                onOpenVisit(visit);
              }}
            >
              <ScheduleSlotTime
                $tone={variant === 'cancelled' ? 'strike' : 'default'}
              >
                {formatTime(visit.startsAt, i18n.language)}
              </ScheduleSlotTime>
              <ScheduleSlotMain>
                <ScheduleSlotName $muted={variant === 'cancelled'}>
                  {visit.patientName}
                </ScheduleSlotName>
                <ScheduleSlotMeta
                  $tone={variant === 'cancelled' ? 'error' : 'default'}
                >
                  {meta}
                </ScheduleSlotMeta>
              </ScheduleSlotMain>
              <SoftStatusPill $tone={softTone(visit.status)}>
                {t(`status.${visit.status}`)}
              </SoftStatusPill>
              <ScheduleChevron>›</ScheduleChevron>
            </ScheduleSlotRow>
          );
        })}

        {freeSlotIsos.map((iso) => (
          <ScheduleSlotRow key={iso} type="button" $variant="free" disabled>
            <ScheduleSlotTime $tone="accent">{formatTime(iso, i18n.language)}</ScheduleSlotTime>
            <ScheduleSlotMain>
              <ScheduleSlotName $muted>
                {t('modals.freeSlotTitle', { minutes: 30 })}
              </ScheduleSlotName>
            </ScheduleSlotMain>
            <ScheduleChevron>+</ScheduleChevron>
          </ScheduleSlotRow>
        ))}
      </ModalPaper>
    </ScheduleDialog>
  );
};
