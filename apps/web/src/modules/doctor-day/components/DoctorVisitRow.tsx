import { Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import { useCanCompleteVisit } from '@/modules/doctor-day/hooks/useCanCompleteVisit';
import type { DoctorDayVisit } from '@/modules/doctor-day/types';
import {
  CompleteTooltipTarget,
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
  VisitIdentity,
  VisitMain,
  VisitRow,
} from '@/modules/doctor-day/styles';
import { splitPatientName } from '@/modules/doctor-day/utils/mapDashboard';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

interface DoctorVisitRowProps {
  visit: DoctorDayVisit;
  showDate?: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
  onOpen?: () => void;
}

const formatShortDateTime = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

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
  showDate = false,
  onComplete,
  onCancel,
  onOpen,
}: DoctorVisitRowProps) => {
  const { t, i18n } = useTranslation('doctorDay');
  const canComplete = useCanCompleteVisit(visit.startsAt, visit.status);
  const mutedTime =
    visit.status === 'completed' ||
    visit.status === 'cancelled' ||
    visit.status === 'rescheduled';
  const timeLabel = showDate
    ? formatShortDateTime(visit.startsAt, i18n.language)
    : formatTime(visit.startsAt, i18n.language);

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
      <RowTime $muted={mutedTime}>{timeLabel}</RowTime>

      <VisitIdentity>
        <DoctorPhoto
          photoUrl={visit.photoUrl}
          {...splitPatientName(visit.patientName)}
          size="sm"
          alt={visit.patientName}
        />
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
      </VisitIdentity>

      {visit.status === 'upcoming' ? (
        <RowActions>
          <Tooltip
            title={canComplete ? '' : t('rowActions.completeBeforeStart')}
            disableHoverListener={canComplete}
          >
            <CompleteTooltipTarget
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <SmallButton
                variant="contained"
                color="primary"
                size="small"
                disabled={!canComplete}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!canComplete) {
                    return;
                  }
                  onComplete?.();
                }}
              >
                {t('rowActions.complete')}
              </SmallButton>
            </CompleteTooltipTarget>
          </Tooltip>
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
  const canComplete = useCanCompleteVisit(visit.startsAt, visit.status);

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

        <VisitIdentity>
          <DoctorPhoto
            photoUrl={visit.photoUrl}
            {...splitPatientName(visit.patientName)}
            size="md"
            alt={visit.patientName}
          />
          <VisitMain>
            <DoctorLine>{visit.patientName}</DoctorLine>
            <RowTitleLine>
              <FormatChip>{t(`format.${visit.format}`)}</FormatChip>
              {visit.reason ? <RowMeta>{t('list.reason', { reason: visit.reason })}</RowMeta> : null}
            </RowTitleLine>
          </VisitMain>
        </VisitIdentity>

        <HeroActions>
          <Tooltip
            title={canComplete ? '' : t('rowActions.completeBeforeStart')}
            disableHoverListener={canComplete}
          >
            <CompleteTooltipTarget
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!canComplete}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!canComplete) {
                    return;
                  }
                  onComplete();
                }}
              >
                {t('nextVisit.complete')}
              </Button>
            </CompleteTooltipTarget>
          </Tooltip>
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
