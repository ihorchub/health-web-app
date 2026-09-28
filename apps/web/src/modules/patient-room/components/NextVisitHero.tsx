import { useTranslation } from 'react-i18next';

import {
  DangerOutlineButton,
  DoctorLine,
  FormatChip,
  MetaLine,
  NextVisitBody,
  NextVisitCard,
  NextVisitHead,
  OutlineButton,
  OverlineLabel,
  RowActions,
  StatusPill,
  TimeBlock,
  TimeMeta,
  TimeValue,
  VisitMain,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { doctorDisplayName } from '@/modules/patient-room/utils/mapCabinet';

interface NextVisitHeroProps {
  appointment: CabinetAppointment;
  onReschedule: () => void;
  onCancel: () => void;
  onDecide?: () => void;
  onOpen: () => void;
}

export const NextVisitHero = ({
  appointment,
  onReschedule,
  onCancel,
  onDecide,
  onOpen,
}: NextVisitHeroProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const isPending = appointment.status === 'reschedule_pending';
  const doctorName = doctorDisplayName(appointment);
  const specialty = appointment.specialty
    ? t(`search:specialties.${appointment.specialty}`, {
        defaultValue: appointment.specialty,
      })
    : '';
  const clinicLabel = appointment.clinicName;

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
        <OverlineLabel>{t('cabinet:nextVisit.label')}</OverlineLabel>
        <StatusPill $tone={isPending ? 'warning' : 'accent'}>
          {isPending
            ? t('cabinet:nextVisit.statusPending')
            : t('cabinet:nextVisit.statusUpcoming')}
        </StatusPill>
      </NextVisitHead>

      <NextVisitBody>
        <TimeBlock>
          <TimeValue>{formatTime(appointment.startsAt, i18n.language)}</TimeValue>
          <TimeMeta>
            {t('cabinet:nextVisit.todayDuration', { minutes: appointment.durationMinutes })}
          </TimeMeta>
        </TimeBlock>

        <VisitMain>
          <DoctorLine>{doctorName}</DoctorLine>
          <MetaLine>
            <FormatChip>{t(`cabinet:format.${appointment.format}`)}</FormatChip>
            <span>
              {specialty} · {clinicLabel}
            </span>
          </MetaLine>
        </VisitMain>

        <RowActions>
          {isPending ? (
            <OutlineButton
              variant="contained"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                onDecide?.();
              }}
            >
              {t('cabinet:pendingDecision.decide')}
            </OutlineButton>
          ) : (
            <>
              <OutlineButton
                variant="outlined"
                color="inherit"
                onClick={(event) => {
                  event.stopPropagation();
                  onReschedule();
                }}
              >
                {t('cabinet:nextVisit.move')}
              </OutlineButton>
              <DangerOutlineButton
                variant="outlined"
                onClick={(event) => {
                  event.stopPropagation();
                  onCancel();
                }}
              >
                {t('cabinet:nextVisit.cancel')}
              </DangerOutlineButton>
            </>
          )}
        </RowActions>
      </NextVisitBody>
    </NextVisitCard>
  );
};
