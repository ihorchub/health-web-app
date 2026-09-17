import { IconStarFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  DangerOutlineButton,
  FormatChip,
  OutlineButton,
  ReviewBadge,
  RowActions,
  RowDateLabel,
  RowDoctorName,
  RowMain,
  RowMetaText,
  RowTitleLine,
  StatusPill,
  VisitRow,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import {
  formatRelativeDayLabel,
  formatTime,
} from '@/modules/patient-room/utils/formatCabinetDate';

interface AppointmentRowProps {
  appointment: CabinetAppointment;
  variant: 'upcoming' | 'past';
  onReschedule?: () => void;
  onCancel?: () => void;
  onDecide?: () => void;
  onLeaveReview?: () => void;
  onOpen?: () => void;
}

export const AppointmentRow = ({
  appointment,
  variant,
  onReschedule,
  onCancel,
  onDecide,
  onLeaveReview,
  onOpen,
}: AppointmentRowProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const isPending = appointment.status === 'reschedule_pending';
  const doctor = findMockDoctor(appointment.doctorId);
  const doctorName = doctor
    ? `${doctor.firstName} ${doctor.lastName}`
    : appointment.doctorId;
  const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';
  const clinicLabel = t('cabinet:demoClinic');

  const dayLabel =
    variant === 'upcoming'
      ? formatRelativeDayLabel(appointment.startsAt, i18n.language, {
          today: t('cabinet:today'),
          tomorrow: t('cabinet:upcoming.tomorrow'),
        })
      : formatTime(appointment.startsAt, i18n.language);

  const statusTone =
    appointment.status === 'completed'
      ? 'accent'
      : appointment.status === 'cancelled'
        ? 'muted'
        : appointment.status === 'reschedule_pending'
          ? 'warning'
          : 'accent';

  return (
    <VisitRow
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
      {variant === 'upcoming' ? <RowDateLabel>{dayLabel}</RowDateLabel> : null}

      <RowMain>
        <RowTitleLine>
          <RowDoctorName>{doctorName}</RowDoctorName>
          {variant === 'past' ? (
            <StatusPill $tone={statusTone}>{t(`cabinet:status.${appointment.status}`)}</StatusPill>
          ) : (
            <>
              <FormatChip>{t(`cabinet:format.${appointment.format}`)}</FormatChip>
              <StatusPill $tone={isPending ? 'warning' : 'accent'}>
                {isPending
                  ? t('cabinet:status.reschedule_pending')
                  : t('cabinet:nextVisit.statusUpcoming')}
              </StatusPill>
            </>
          )}
        </RowTitleLine>
        <RowMetaText>
          {t('cabinet:rowMeta', {
            time: formatTime(appointment.startsAt, i18n.language),
            specialty,
            clinic: clinicLabel,
          })}
        </RowMetaText>
        {appointment.status === 'cancelled' && appointment.cancelledBy ? (
          <RowMetaText>
            {appointment.cancelledBy === 'doctor'
              ? t('cabinet:cancelledByDoctor')
              : t('cabinet:cancelledByPatient')}
          </RowMetaText>
        ) : null}
      </RowMain>

      {variant === 'upcoming' ? (
        <RowActions>
          {isPending ? (
            <OutlineButton
              variant="contained"
              color="primary"
              size="small"
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
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onReschedule?.();
                }}
              >
                {t('cabinet:nextVisit.move')}
              </OutlineButton>
              <DangerOutlineButton
                variant="outlined"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onCancel?.();
                }}
              >
                {t('cabinet:nextVisit.cancel')}
              </DangerOutlineButton>
            </>
          )}
        </RowActions>
      ) : null}

      {variant === 'past' && appointment.status === 'completed' ? (
        appointment.hasPatientReview ? (
          <ReviewBadge>
            <IconStarFilled size={16} />
            {t('cabinet:past.yourReview')}
          </ReviewBadge>
        ) : (
          <OutlineButton
            variant="outlined"
            color="primary"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onLeaveReview?.();
            }}
          >
            {t('cabinet:past.leaveReview')}
          </OutlineButton>
        )
      ) : null}
    </VisitRow>
  );
};
