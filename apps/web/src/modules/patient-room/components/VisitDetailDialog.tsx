import { IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import { useGetReferenceCities } from '@/api/reference';
import { cityNameMap, useClinicNamesByCityIds } from '@/hooks/useClinicNamesByCityIds';
import {
  DangerOutlineButton,
  OutlineButton,
  StatusPill,
  VisitDetailActions,
  VisitDetailAvatar,
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
): 'accent' | 'warning' | 'muted' | 'soft' => {
  if (status === 'reschedule_pending') {
    return 'warning';
  }
  if (status === 'completed') {
    return 'soft';
  }
  if (status === 'cancelled' || status === 'rescheduled') {
    return 'muted';
  }
  return 'warning';
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

  const citiesQuery = useGetReferenceCities();
  const cityNames = useMemo(
    () => cityNameMap(citiesQuery.data?.items ?? []),
    [citiesQuery.data?.items],
  );

  const doctor = appointment ? findMockDoctor(appointment.doctorId) : undefined;
  const clinicNames = useClinicNamesByCityIds(doctor ? [doctor.cityId] : []);

  if (!appointment) {
    return null;
  }

  const doctorName = doctor
    ? t('cabinet:visitModal.doctorName', {
        name: `${doctor.firstName} ${doctor.lastName}`,
      })
    : appointment.doctorId;
  const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';
  const clinicName = doctor
    ? (clinicNames[doctor.clinicId] ?? t('cabinet:demoClinic'))
    : t('cabinet:demoClinic');
  const cityName = doctor ? (cityNames[doctor.cityId] ?? '') : '';
  const price = doctor ? (doctor.promoPrice ?? doctor.basePrice) : null;
  const canAct = appointment.status === 'upcoming';
  const canReview =
    appointment.status === 'completed' && !appointment.hasPatientReview;

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
          <VisitDetailAvatar src={doctor?.photoUrl} alt="" />
          <VisitDetailMetaCopy>
            <VisitDetailSpecialty>{specialty}</VisitDetailSpecialty>
            <span>
              {t('cabinet:visitModal.clinicLine', {
                clinic: clinicName,
                city: cityName,
              })}
            </span>
            {doctor?.address ? <span>{doctor.address}</span> : null}
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
        {price !== null ? (
          <VisitDetailField>
            <VisitDetailFieldLabel>{t('cabinet:visitModal.price')}</VisitDetailFieldLabel>
            <VisitDetailFieldValue>
              {t('cabinet:visitModal.priceValue', { amount: price })}
            </VisitDetailFieldValue>
          </VisitDetailField>
        ) : null}
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
