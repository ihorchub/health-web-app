import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
  DangerOutlineButton,
  OutlineButton,
  StatusPill,
  VisitDetailActions,
  VisitDetailBody,
  VisitDetailClose,
  VisitDetailDialogRoot,
  VisitDetailDoctorLink,
  VisitDetailField,
  VisitDetailFieldLabel,
  VisitDetailFieldValue,
  VisitDetailFields,
  VisitDetailFormatChip,
  VisitDetailHeader,
  VisitDetailMeta,
  VisitDetailMetaCopy,
  VisitDetailOverline,
  VisitDetailPriceNote,
  VisitDetailSpecialty,
  VisitDetailStatusRow,
  VisitDetailTitle,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { doctorDisplayName } from '@/modules/patient-room/utils/mapCabinet';

interface VisitDetailDialogProps {
  appointment: CabinetAppointment | null;
  open: boolean;
  onClose: () => void;
  onReschedule?: (appointment: CabinetAppointment) => void;
  onCancel?: (appointment: CabinetAppointment) => void;
  onLeaveReview?: (appointment: CabinetAppointment) => void;
  onOpenDoctor?: (appointment: CabinetAppointment) => void;
}

const formatVisitWhen = (iso: string, locale: string) => {
  const date = new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

  return `${date} · ${formatTime(iso, locale)}`;
};

const statusTone = (
  status: CabinetAppointment['status'],
): 'accent' | 'success' | 'info' | 'warning' | 'muted' | 'soft' => {
  if (status === 'reschedule_pending') {
    return 'warning';
  }
  if (status === 'completed') {
    return 'success';
  }
  if (status === 'rescheduled') {
    return 'info';
  }
  if (status === 'cancelled') {
    return 'muted';
  }
  if (status === 'upcoming') {
    return 'accent';
  }
  return 'muted';
};

export const VisitDetailDialog = ({
  appointment,
  open,
  onClose,
  onReschedule,
  onCancel,
  onLeaveReview,
  onOpenDoctor,
}: VisitDetailDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);

  if (!appointment) {
    return null;
  }

  const doctorName = t('cabinet:visitModal.doctorName', {
    name: doctorDisplayName(appointment),
  });
  const specialty = appointment.specialty
    ? t(`search:specialties.${appointment.specialty}`, {
        defaultValue: appointment.specialty,
      })
    : '';
  const clinicName = appointment.clinicName;
  const cityName = appointment.cityName;
  const canAct = appointment.status === 'upcoming';
  const canReview =
    appointment.status === 'completed' &&
    (appointment.canReview ?? !appointment.hasPatientReview);

  return (
    <VisitDetailDialogRoot open={open} onClose={onClose} fullWidth>
      <VisitDetailHeader>
        <div>
          <VisitDetailOverline>{t('cabinet:visitModal.title')}</VisitDetailOverline>
          <VisitDetailTitle>{doctorName}</VisitDetailTitle>
        </div>
        <VisitDetailClose type="button" aria-label={t('cabinet:visitModal.close')} onClick={onClose}>
          <IconX size={18} stroke={1.8} />
        </VisitDetailClose>
      </VisitDetailHeader>

      <VisitDetailStatusRow>
        <StatusPill $tone={statusTone(appointment.status)}>
          {t(`cabinet:status.${appointment.status}`)}
        </StatusPill>
        <VisitDetailFormatChip>{t(`cabinet:format.${appointment.format}`)}</VisitDetailFormatChip>
      </VisitDetailStatusRow>

      <VisitDetailBody>
        <VisitDetailMeta>
          <DoctorPhoto
            photoUrl={appointment.doctorPhotoUrl}
            firstName={appointment.doctorFirstName}
            lastName={appointment.doctorLastName}
            size="md"
          />
          <VisitDetailMetaCopy>
            <VisitDetailSpecialty>{specialty}</VisitDetailSpecialty>
            <span>
              {t('cabinet:visitModal.clinicLine', {
                clinic: clinicName,
                city: cityName,
              })}
            </span>
          </VisitDetailMetaCopy>
        </VisitDetailMeta>
      </VisitDetailBody>

      <VisitDetailFields>
        <VisitDetailField>
          <VisitDetailFieldLabel>{t('cabinet:visitModal.when')}</VisitDetailFieldLabel>
          <VisitDetailFieldValue>
            {formatVisitWhen(appointment.startsAt, i18n.language)}
          </VisitDetailFieldValue>
        </VisitDetailField>
        <VisitDetailField>
          <VisitDetailFieldLabel>{t('cabinet:visitModal.duration')}</VisitDetailFieldLabel>
          <VisitDetailFieldValue>
            {t('cabinet:visitModal.durationValue', {
              minutes: appointment.durationMinutes,
            })}
          </VisitDetailFieldValue>
        </VisitDetailField>
        {appointment.reason ? (
          <VisitDetailField>
            <VisitDetailFieldLabel>{t('cabinet:visitModal.reason')}</VisitDetailFieldLabel>
            <VisitDetailFieldValue>{appointment.reason}</VisitDetailFieldValue>
          </VisitDetailField>
        ) : null}
        {appointment.status === 'cancelled' && appointment.cancelledBy ? (
          <VisitDetailField>
            <VisitDetailFieldLabel>{t('cabinet:visitModal.cancelled')}</VisitDetailFieldLabel>
            <VisitDetailFieldValue>
              {appointment.cancelledBy === 'doctor'
                ? t('cabinet:cancelledByDoctor')
                : t('cabinet:cancelledByPatient')}
            </VisitDetailFieldValue>
          </VisitDetailField>
        ) : null}
      </VisitDetailFields>

      {canAct ? (
        <VisitDetailPriceNote>{t('cabinet:visitModal.priceNote')}</VisitDetailPriceNote>
      ) : null}

      <VisitDetailActions>
        {canAct ? (
          <>
            <OutlineButton
              variant="outlined"
              color="primary"
              onClick={() => {
                onReschedule?.(appointment);
              }}
            >
              {t('cabinet:nextVisit.move')}
            </OutlineButton>
            <DangerOutlineButton
              variant="outlined"
              onClick={() => {
                onCancel?.(appointment);
              }}
            >
              {t('cabinet:nextVisit.cancel')}
            </DangerOutlineButton>
          </>
        ) : null}

        {canReview ? (
          <OutlineButton
            variant="contained"
            color="primary"
            onClick={() => {
              onLeaveReview?.(appointment);
            }}
          >
            {t('cabinet:past.leaveReview')}
          </OutlineButton>
        ) : null}

        <VisitDetailDoctorLink
          type="button"
          onClick={() => {
            onOpenDoctor?.(appointment);
          }}
        >
          {t('cabinet:visitModal.doctorProfile')}
        </VisitDetailDoctorLink>
      </VisitDetailActions>
    </VisitDetailDialogRoot>
  );
};
