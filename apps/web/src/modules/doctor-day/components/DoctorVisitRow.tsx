import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { DoctorDayVisit } from '@/modules/doctor-day/types';
import {
  DangerOutlineButton,
  DoctorLine,
  FormatChip,
  HeroActions,
  NextVisitBody,
  NextVisitCard,
  NextVisitHead,
  OutlineButton,
  OverlineLabel,
  PatientName,
  RowActions,
  RowMain,
  RowMeta,
  RowTime,
  RowTitleLine,
  SmallButton,
  StatusPill,
  TimeBlock,
  TimeMeta,
  TimeValue,
  VisitMain,
  VisitRow,
  WaitingLabel,
} from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

interface DoctorVisitRowProps {
  visit: DoctorDayVisit;
  onComplete?: () => void;
  onPropose?: () => void;
  onCancel?: () => void;
  onOpen?: () => void;
}

const rowVariant = (visit: DoctorDayVisit) => {
  if (visit.status === 'cancelled') {
    return 'cancelled';
  }
  if (visit.status === 'reserved') {
    return 'reserved';
  }
  if (visit.status === 'reschedule_pending') {
    return 'pending';
  }
  return 'default';
};

const statusTone = (
  visit: DoctorDayVisit,
): 'accent' | 'warning' | 'muted' | 'error' | 'reserved' => {
  if (visit.status === 'cancelled') {
    return 'error';
  }
  if (visit.status === 'reschedule_pending') {
    return 'warning';
  }
  if (visit.status === 'reserved') {
    return 'reserved';
  }
  if (visit.status === 'completed' || visit.status === 'rescheduled') {
    return 'muted';
  }
  return 'accent';
};

export const DoctorVisitRow = ({
  visit,
  onComplete,
  onPropose,
  onCancel,
  onOpen,
}: DoctorVisitRowProps) => {
  const { t, i18n } = useTranslation('doctorDay');
  const mutedTime = visit.status === 'completed' || visit.status === 'cancelled';

  return (
    <VisitRow
      $variant={rowVariant(visit)}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen?.();
        }
      }}
    >
      <RowTime $muted={mutedTime}>{formatTime(visit.startsAt, i18n.language)}</RowTime>

      <RowMain>
        <RowTitleLine>
          <PatientName>{visit.patientName}</PatientName>
          <StatusPill $tone={statusTone(visit)}>{t(`status.${visit.status}`)}</StatusPill>
          <FormatChip>{t(`format.${visit.format}`)}</FormatChip>
        </RowTitleLine>
        {visit.pendingNote ? <RowMeta>{visit.pendingNote}</RowMeta> : null}
        {visit.status === 'reschedule_pending' && visit.proposedTime ? (
          <RowMeta>
            {t('list.pendingNote', {
              original: formatTime(visit.startsAt, i18n.language),
              proposed: formatTime(visit.proposedTime, i18n.language),
            })}
          </RowMeta>
        ) : null}
        {visit.status === 'reserved' ? <RowMeta>{t('list.reservedNote')}</RowMeta> : null}
        {!visit.pendingNote &&
        visit.status !== 'reschedule_pending' &&
        visit.status !== 'reserved' &&
        visit.reason ? (
          <RowMeta>{t('list.reason', { reason: visit.reason })}</RowMeta>
        ) : null}
        {!visit.pendingNote && visit.status === 'cancelled' && visit.cancelledBy ? (
          <RowMeta>
            {visit.cancelledBy === 'patient'
              ? t('list.cancelledByPatientShort')
              : t('list.cancelledByDoctorShort')}
          </RowMeta>
        ) : null}
      </RowMain>

      {visit.status === 'upcoming' ? (
        <RowActions>
          <SmallButton
            variant="contained"
            color="primary"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onComplete?.();
            }}
          >
            {t('rowActions.complete')}
          </SmallButton>
          <SmallButton
            variant="outlined"
            color="inherit"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onPropose?.();
            }}
          >
            {t('rowActions.propose')}
          </SmallButton>
          <SmallButton
            variant="outlined"
            color="error"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onCancel?.();
            }}
          >
            {t('rowActions.cancel')}
          </SmallButton>
        </RowActions>
      ) : null}

      {visit.status === 'reschedule_pending' ? (
        <WaitingLabel>{t('list.waitingPatient')}</WaitingLabel>
      ) : null}

      {visit.status === 'reserved' ? (
        <WaitingLabel>{t('list.proposalLabel')}</WaitingLabel>
      ) : null}
    </VisitRow>
  );
};

interface DoctorNextVisitHeroProps {
  visit: DoctorDayVisit;
  onComplete: () => void;
  onPropose: () => void;
  onCancel: () => void;
  onOpen: () => void;
}

export const DoctorNextVisitHero = ({
  visit,
  onComplete,
  onPropose,
  onCancel,
  onOpen,
}: DoctorNextVisitHeroProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  return (
    <NextVisitCard
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <NextVisitHead>
        <OverlineLabel>{t('nextVisit.label')}</OverlineLabel>
        <StatusPill $tone="accent">{t('nextVisit.statusUpcoming')}</StatusPill>
      </NextVisitHead>

      <NextVisitBody>
        <TimeBlock>
          <TimeValue>{formatTime(visit.startsAt, i18n.language)}</TimeValue>
          <TimeMeta>{t('nextVisit.durationMin', { minutes: visit.durationMinutes })}</TimeMeta>
        </TimeBlock>

        <VisitMain>
          <DoctorLine>{visit.patientName}</DoctorLine>
          <RowTitleLine>
            <FormatChip>{t(`format.${visit.format}`)}</FormatChip>
            {visit.reason ? <RowMeta>{t('list.reason', { reason: visit.reason })}</RowMeta> : null}
          </RowTitleLine>
        </VisitMain>

        <HeroActions>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              onComplete();
            }}
          >
            {t('nextVisit.complete')}
          </Button>
          <OutlineButton
            variant="outlined"
            color="inherit"
            onClick={(event) => {
              event.stopPropagation();
              onPropose();
            }}
          >
            {t('nextVisit.propose')}
          </OutlineButton>
          <DangerOutlineButton
            variant="outlined"
            onClick={(event) => {
              event.stopPropagation();
              onCancel();
            }}
          >
            {t('nextVisit.cancel')}
          </DangerOutlineButton>
        </HeroActions>
      </NextVisitBody>
    </NextVisitCard>
  );
};
