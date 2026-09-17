import { IconStar, IconStarFilled, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  ReviewCancelButton,
  ReviewCommentLabelRow,
  ReviewDialogBody,
  ReviewDialogContext,
  ReviewDialogDoctor,
  ReviewDialogFooter,
  ReviewDialogHeader,
  ReviewDialogMeta,
  ReviewDialogOverline,
  ReviewDialogRoot,
  ReviewDialogTitle,
  ReviewFieldLabel,
  ReviewOptional,
  ReviewStarButton,
  ReviewStarsRow,
  ReviewSubmitButton,
  ReviewTextArea,
  VisitDetailClose,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';

interface WriteReviewDialogProps {
  appointment: CabinetAppointment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}

const formatShortWhen = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

export const WriteReviewDialog = ({
  appointment,
  open,
  onClose,
  onSubmit,
}: WriteReviewDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const [rating, setRating] = useState(4);
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setRating(4);
      setText('');
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  if (!appointment) {
    return null;
  }

  const doctor = findMockDoctor(appointment.doctorId);
  const doctorName = doctor
    ? t('cabinet:visitModal.doctorName', {
        name: `${doctor.firstName} ${doctor.lastName}`,
      })
    : appointment.doctorId;
  const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';

  return (
    <ReviewDialogRoot open={open} onClose={handleClose} fullWidth>
      <ReviewDialogHeader>
        <div>
          <ReviewDialogOverline>{t('cabinet:reviewModal.eyebrow')}</ReviewDialogOverline>
          <ReviewDialogTitle>{t('cabinet:reviewModal.title')}</ReviewDialogTitle>
        </div>
        <VisitDetailClose
          type="button"
          aria-label={t('cabinet:reviewModal.cancel')}
          onClick={handleClose}
        >
          <IconX size={18} stroke={1.8} />
        </VisitDetailClose>
      </ReviewDialogHeader>

      <ReviewDialogContext>
        <ReviewDialogDoctor>{doctorName}</ReviewDialogDoctor>
        <ReviewDialogMeta>
          {t('cabinet:reviewModal.context', {
            when: formatShortWhen(appointment.startsAt, i18n.language),
            specialty,
            format: t(`cabinet:format.${appointment.format}`),
            status: t(`cabinet:status.${appointment.status}`),
          })}
        </ReviewDialogMeta>
      </ReviewDialogContext>

      <ReviewDialogBody>
        <div>
          <ReviewFieldLabel>{t('cabinet:reviewModal.rating')}</ReviewFieldLabel>
          <ReviewStarsRow>
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const active = value <= rating;
              return (
                <ReviewStarButton
                  key={value}
                  type="button"
                  aria-label={`${value}`}
                  onClick={() => {
                    setRating(value);
                  }}
                >
                  {active ? <IconStarFilled size={28} /> : <IconStar size={28} stroke={1.5} />}
                </ReviewStarButton>
              );
            })}
          </ReviewStarsRow>
        </div>

        <div>
          <ReviewCommentLabelRow>
            <ReviewFieldLabel>{t('cabinet:reviewModal.comment')}</ReviewFieldLabel>
            <ReviewOptional>{t('cabinet:reviewModal.optional')}</ReviewOptional>
          </ReviewCommentLabelRow>
          <ReviewTextArea
            value={text}
            placeholder={t('cabinet:reviewModal.textPlaceholder')}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        </div>
      </ReviewDialogBody>

      <ReviewDialogFooter>
        <ReviewCancelButton variant="outlined" color="inherit" onClick={handleClose}>
          {t('cabinet:reviewModal.cancel')}
        </ReviewCancelButton>
        <ReviewSubmitButton
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit(rating, text);
            handleClose();
          }}
        >
          {t('cabinet:reviewModal.submit')}
        </ReviewSubmitButton>
      </ReviewDialogFooter>
    </ReviewDialogRoot>
  );
};
