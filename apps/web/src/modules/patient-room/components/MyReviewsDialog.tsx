import { IconStarFilled, IconX } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
  OutlineButton,
  ReviewsListBody,
  ReviewsListDialogRoot,
  ReviewsListEmpty,
  ReviewsListItem,
  ReviewsListItemCopy,
  ReviewsListItemDoctor,
  ReviewsListItemMeta,
  ReviewsListItemTop,
  ReviewsListSection,
  ReviewsListSectionTitle,
  ReviewsListStars,
  ReviewsListText,
  VisitDetailClose,
  VisitDetailHeader,
  VisitDetailOverline,
  VisitDetailTitle,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import { doctorDisplayName } from '@/modules/patient-room/utils/mapCabinet';

interface MyReviewsDialogProps {
  open: boolean;
  appointments: CabinetAppointment[];
  onClose: () => void;
  onLeaveReview: (appointment: CabinetAppointment) => void;
}

const isPendingReview = (item: CabinetAppointment) =>
  item.status === 'completed' && (item.canReview ?? !item.hasPatientReview);

const isLeftReview = (item: CabinetAppointment) => Boolean(item.hasPatientReview);

const formatShortWhen = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

export const MyReviewsDialog = ({
  open,
  appointments,
  onClose,
  onLeaveReview,
}: MyReviewsDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);

  const { pending, left } = useMemo(() => {
    const sortDesc = (a: CabinetAppointment, b: CabinetAppointment) =>
      b.startsAt.localeCompare(a.startsAt);

    return {
      pending: appointments.filter(isPendingReview).sort(sortDesc),
      left: appointments.filter(isLeftReview).sort(sortDesc),
    };
  }, [appointments]);

  const isEmpty = pending.length === 0 && left.length === 0;

  return (
    <ReviewsListDialogRoot open={open} onClose={onClose} fullWidth>
      <VisitDetailHeader>
        <div>
          <VisitDetailOverline>{t('cabinet:sidebar.reviewsTitle')}</VisitDetailOverline>
          <VisitDetailTitle>{t('cabinet:reviewsList.title')}</VisitDetailTitle>
        </div>
        <VisitDetailClose type="button" aria-label={t('cabinet:visitModal.close')} onClick={onClose}>
          <IconX size={20} stroke={1.75} />
        </VisitDetailClose>
      </VisitDetailHeader>

      <ReviewsListBody>
        {isEmpty ? (
          <ReviewsListEmpty>{t('cabinet:reviewsList.empty')}</ReviewsListEmpty>
        ) : null}

        {pending.length > 0 ? (
          <ReviewsListSection>
            <ReviewsListSectionTitle>
              {t('cabinet:reviewsList.pendingTitle', { count: pending.length })}
            </ReviewsListSectionTitle>
            {pending.map((item) => {
              const specialty = item.specialty
                ? t(`search:specialties.${item.specialty}`, {
                    defaultValue: item.specialty,
                  })
                : '';
              const when = formatShortWhen(item.startsAt, i18n.language);

              return (
                <ReviewsListItem key={item.id}>
                  <ReviewsListItemTop>
                    <DoctorPhoto
                      photoUrl={item.doctorPhotoUrl}
                      firstName={item.doctorFirstName}
                      lastName={item.doctorLastName}
                      size="sm"
                    />
                    <ReviewsListItemCopy>
                      <ReviewsListItemDoctor>
                        {t('cabinet:visitModal.doctorName', {
                          name: doctorDisplayName(item),
                        })}
                      </ReviewsListItemDoctor>
                      <ReviewsListItemMeta>
                        {[when, specialty, item.clinicName].filter(Boolean).join(' · ')}
                      </ReviewsListItemMeta>
                    </ReviewsListItemCopy>
                  </ReviewsListItemTop>
                  <OutlineButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      onLeaveReview(item);
                    }}
                  >
                    {t('cabinet:past.leaveReview')}
                  </OutlineButton>
                </ReviewsListItem>
              );
            })}
          </ReviewsListSection>
        ) : null}

        {left.length > 0 ? (
          <ReviewsListSection>
            <ReviewsListSectionTitle>
              {t('cabinet:reviewsList.leftTitle', { count: left.length })}
            </ReviewsListSectionTitle>
            {left.map((item) => {
              const specialty = item.specialty
                ? t(`search:specialties.${item.specialty}`, {
                    defaultValue: item.specialty,
                  })
                : '';
              const when = formatShortWhen(item.startsAt, i18n.language);
              const rating = item.patientReviewRating ?? 0;

              return (
                <ReviewsListItem key={item.id}>
                  <ReviewsListItemTop>
                    <DoctorPhoto
                      photoUrl={item.doctorPhotoUrl}
                      firstName={item.doctorFirstName}
                      lastName={item.doctorLastName}
                      size="sm"
                    />
                    <ReviewsListItemCopy>
                      <ReviewsListItemDoctor>
                        {t('cabinet:visitModal.doctorName', {
                          name: doctorDisplayName(item),
                        })}
                      </ReviewsListItemDoctor>
                      <ReviewsListItemMeta>
                        {[when, specialty, item.clinicName].filter(Boolean).join(' · ')}
                      </ReviewsListItemMeta>
                      <ReviewsListStars aria-label={t('cabinet:reviewsList.rating', { rating })}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <IconStarFilled
                            key={index}
                            size={14}
                            opacity={index < rating ? 1 : 0.25}
                          />
                        ))}
                      </ReviewsListStars>
                      {item.patientReviewText ? (
                        <ReviewsListText>{item.patientReviewText}</ReviewsListText>
                      ) : null}
                    </ReviewsListItemCopy>
                  </ReviewsListItemTop>
                </ReviewsListItem>
              );
            })}
          </ReviewsListSection>
        ) : null}
      </ReviewsListBody>
    </ReviewsListDialogRoot>
  );
};
