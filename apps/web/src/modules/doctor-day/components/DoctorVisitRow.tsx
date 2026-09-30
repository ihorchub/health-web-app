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
} from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

interface DoctorVisitRowProps {
  visit: DoctorDayVisit;
  onComplete?: () => void;
  onCancel?: () => void;
  onOpen?: () => void;
}

const rowVariant = (visit: DoctorDayVisit) => {
  if (visit.status === 'cancelled') {
    return 'cancelled';
  }
  return 'default';
};

const statusTone = (visit: DoctorDayVisit): 'accent' | 'muted' | 'error' => {
  if (visit.status === 'cancelled') {
    return 'error';
  }
  if (visit.status === 'completed' || visit.status === 'rescheduled') {
    return 'muted';
  }
  return 'accent';
};

export const DoctorVisitRow = ({
  visit,
  onComplete,
  onCancel,
  onOpen,
}: DoctorVisitRowProps) => {
  const { t, i18n } = useTranslation('doctorDay');
  const mutedTime =
    visit.status === 'completed' ||
    visit.status === 'cancelled' ||
    visit.status === 'rescheduled';

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
        {visit.reason ? <RowMeta>{t('list.reason', { reason: visit.reason })}</RowMeta> : null}
        {visit.status === 'cancelled' && visit.cancelledBy ? (
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
    </VisitRow>
  );
};

interface DoctorNextVisitHeroProps {
  visit: DoctorDayVisit;
  onComplete: () => void;
  onCancel: () => void;
  onOpen: () => void;
}

export const DoctorNextVisitHero = ({
  visit,
  onComplete,
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
