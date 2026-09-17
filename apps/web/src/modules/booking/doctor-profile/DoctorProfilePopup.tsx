import { Button } from '@mui/material';
import { IconHeart, IconHeartFilled, IconStarFilled, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  isSlotTakenError,
  usePostBookAppointment,
} from '@/api/appointments';
import {
  useGetDoctorById,
  useGetDoctorCalendar,
  isDoctorNotFoundError,
} from '@/api/doctors';
import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { useAppRole } from '@/hooks/useAppRole';
import { usePopups } from '@/hooks/usePopups';
import { CalendarStep } from '@/modules/booking/calendar/CalendarStep';
import { ConfirmStep } from '@/modules/booking/confirm/ConfirmStep';
import {
  AddressLine,
  BioBlock,
  BioText,
  ClinicBlock,
  ClinicLine,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogShell,
  DialogTitle,
  DoctorName,
  FactCell,
  FactsRow,
  FactValue,
  FieldLabel,
  HeaderText,
  IconRoundButton,
  IdentityMain,
  IdentityRow,
  NameBlock,
  NameRow,
  Photo,
  Price,
  PriceBlock,
  PriceRatingRow,
  PriceRow,
  ProfileDialog,
  RatingBlock,
  RatingNumber,
  RatingValueRow,
  ReviewAuthor,
  ReviewCount,
  ReviewItem,
  ReviewItemHeader,
  ReviewsHeader,
  ReviewsSection,
  ReviewScore,
  ReviewsTitle,
  ReviewStars,
  ReviewText,
  SpecialtyText,
  StateBox,
  StepLabel,
  StruckPrice,
} from '@/modules/booking/doctor-profile/styles';
import { WizardDoctorStrip } from '@/modules/booking/wizard/WizardDoctorStrip';
import type {
  BookingSelection,
  BookingVisitFormat,
  BookingWizardStep,
} from '@/modules/booking/wizard/types';
import { AppRole } from '@/types/role';
import {
  clearPendingReschedulePick,
  dispatchPendingRescheduleResolved,
  readPendingReschedulePick,
} from '@/modules/patient-room/utils/pendingRescheduleEvents';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';
import { Popups, type DoctorProfilePopupPayload } from '@/utils/popupUtils/popupTypes';
import { AppRoute, doctorProfilePath } from '@/utils/routeUtils/routes';

const CONFIRM_FORM_ID = 'booking-confirm-form';

const reviewCountKey = (count: number, language: string) => {
  if (language.startsWith('en')) {
    return count === 1 ? 'reviews_one' : 'reviews_other';
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return 'reviews_one';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'reviews_few';
  }
  return 'reviews_many';
};

const experienceKey = (count: number, language: string) => {
  if (language.startsWith('en')) {
    return count === 1 ? 'experienceYears_one' : 'experienceYears_other';
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return 'experienceYears_one';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'experienceYears_few';
  }
  return 'experienceYears_many';
};

const formatLabel = (
  supported: 'offline' | 'online' | 'both',
  t: (key: string) => string,
) => {
  if (supported === 'both') {
    return t('formatBoth');
  }
  if (supported === 'online') {
    return t('formatOnline');
  }
  return t('formatOffline');
};

const defaultFormat = (
  supported: 'offline' | 'online' | 'both',
): BookingVisitFormat => (supported === 'online' ? 'online' : 'offline');

export const DoctorProfilePopup = () => {
  const { t, i18n } = useTranslation('booking');
  const { t: tSearch } = useTranslation('search');
  const navigate = useNavigate();
  const { activePopup, payload, closePopup } = usePopups();
  const { role, isSession } = useAppRole();
  const isPatient = role === AppRole.PATIENT && isSession;

  const doctorId =
    activePopup === Popups.DOCTOR_PROFILE
      ? (payload as DoctorProfilePopupPayload | undefined)?.doctorId
      : undefined;

  const open = activePopup === Popups.DOCTOR_PROFILE && Boolean(doctorId);

  const [step, setStep] = useState<BookingWizardStep>('profile');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStartAt, setSelectedStartAt] = useState<string | null>(null);
  const [visitFormat, setVisitFormat] = useState<BookingVisitFormat>('offline');
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const profileQuery = useGetDoctorById(doctorId, { isPatient });
  const citiesQuery = useGetReferenceCities();
  const clinicsQuery = useGetReferenceClinics(profileQuery.data?.cityId);
  const bookMutation = usePostBookAppointment();

  const calendarQuery = useGetDoctorCalendar(
    doctorId,
    { date: selectedDate || undefined },
    {
      enabled: open && step !== 'profile' && isPatient,
      refetchIntervalMs: step === 'calendar' ? 30_000 : false,
    },
  );

  const doctor = profileQuery.data;
  const cityName =
    citiesQuery.data?.items.find((city) => city.id === doctor?.cityId)?.name ?? '';
  const clinicName =
    clinicsQuery.data?.items.find((clinic) => clinic.id === doctor?.clinicId)?.name ??
    '';

  useEffect(() => {
    if (!open) {
      setStep('profile');
      setSelectedDate('');
      setSelectedStartAt(null);
      setSelection(null);
      setConfirmError(null);
      return;
    }

    const popupPayload = payload as DoctorProfilePopupPayload | undefined;
    if (popupPayload?.initialStep && popupPayload.initialStep !== 'profile') {
      setStep(popupPayload.initialStep);
      setSelectedStartAt(null);
      setSelection(null);
      setConfirmError(null);
    }
  }, [open, payload]);

  useEffect(() => {
    if (open && doctor) {
      setVisitFormat(defaultFormat(doctor.supportedFormats));
    }
  }, [open, doctor?.id, doctor?.supportedFormats]);

  useEffect(() => {
    if (!calendarQuery.data || selectedDate) {
      return;
    }
    const firstFree =
      calendarQuery.data.days.find((day) => day.flag === 'has_free')?.date ??
      calendarQuery.data.zoneAStart;
    setSelectedDate(firstFree);
  }, [calendarQuery.data, selectedDate]);

  const stepNumber = step === 'profile' ? 1 : step === 'calendar' ? 2 : 3;

  const stepTitle = useMemo(() => {
    if (step === 'calendar') {
      return t('calendar.title');
    }
    if (step === 'confirm') {
      return t('confirm.title');
    }
    return t('title');
  }, [step, t]);

  const closeAndGoHome = () => {
    closePopup();
    void navigate(AppRoute.HOME);
  };

  const goLogin = () => {
    const returnTo = doctorId ? doctorProfilePath(doctorId) : AppRoute.HOME;
    closePopup();
    void navigate(`${AppRoute.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleFavourite = () => {
    if (role === AppRole.GUEST || !isSession) {
      goLogin();
      return;
    }
    toast.message(t('favoriteSoon'));
  };

  const handleChooseTime = () => {
    if (role === AppRole.GUEST || !isSession) {
      goLogin();
      return;
    }
    if (role !== AppRole.PATIENT) {
      toast.message(t('patientOnly'));
      return;
    }
    setSelectedStartAt(null);
    setConfirmError(null);
    setStep('calendar');
  };

  const handleContinueFromCalendar = () => {
    if (!calendarQuery.data || !selectedStartAt || !selectedDate) {
      return;
    }
    setSelection({
      date: selectedDate,
      startAt: selectedStartAt,
      format: visitFormat,
      visitDurationMinutes: calendarQuery.data.visitDurationMinutes,
    });
    setConfirmError(null);
    setStep('confirm');
  };

  const handleConfirm = async (reason: string) => {
    if (!doctorId || !selection) {
      return;
    }
    setConfirmError(null);
    try {
      await bookMutation.mutateAsync({
        doctorId,
        startAt: selection.startAt,
        format: selection.format,
        reason,
      });

      const pendingId = readPendingReschedulePick();
      if (pendingId) {
        dispatchPendingRescheduleResolved({
          pendingId,
          doctorId,
          newStartsAt: selection.startAt,
          format: selection.format,
          durationMinutes: selection.visitDurationMinutes,
        });
        clearPendingReschedulePick();
      }

      toast.success(t('confirm.successToast'));
      closePopup();
      void navigate(AppRoute.APPOINTMENTS);
    } catch (error) {
      if (isSlotTakenError(error)) {
        setConfirmError(t('confirm.slotTaken'));
        return;
      }
      setConfirmError(t('confirm.errorGeneric'));
    }
  };

  const isNotFound = isDoctorNotFoundError(profileQuery.error);
  const durationMinutes =
    calendarQuery.data?.visitDurationMinutes ?? selection?.visitDurationMinutes ?? 30;

  return (
    <ProfileDialog open={open} onClose={closeAndGoHome} fullWidth>
      <DialogShell>
        <DialogHeader>
          <HeaderText>
            <StepLabel>{t('step', { current: stepNumber, total: 3 })}</StepLabel>
            <DialogTitle>{stepTitle}</DialogTitle>
          </HeaderText>
          <IconRoundButton type="button" aria-label={t('close')} onClick={closeAndGoHome}>
            <IconX size={20} stroke={1.75} />
          </IconRoundButton>
        </DialogHeader>

        {step !== 'profile' && doctor ? (
          <WizardDoctorStrip
            doctor={doctor}
            doctorPrefix={t('doctorPrefix')}
            specialtyLabel={tSearch(`specialties.${doctor.specialty}`)}
            clinicName={clinicName}
            durationLabel={t('durationMinutes', { count: durationMinutes })}
          />
        ) : null}

        {profileQuery.isLoading ? (
          <StateBox>
            <DialogTitle>{t('loading')}</DialogTitle>
          </StateBox>
        ) : null}

        {isNotFound ? (
          <StateBox>
            <DialogTitle>{t('notFoundTitle')}</DialogTitle>
            <BioText>{t('notFoundBody')}</BioText>
            <Button variant="contained" color="primary" onClick={closeAndGoHome}>
              {t('back')}
            </Button>
          </StateBox>
        ) : null}

        {profileQuery.isError && !isNotFound ? (
          <StateBox>
            <DialogTitle>{t('errorTitle')}</DialogTitle>
            <BioText>{t('errorBody')}</BioText>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                void profileQuery.refetch();
              }}
            >
              {t('retry')}
            </Button>
          </StateBox>
        ) : null}

        {doctor && step === 'profile' ? (
          <>
            <DialogBody>
              <IdentityRow>
                <Photo src={doctor.photoUrl} alt="" />
                <IdentityMain>
                  <NameRow>
                    <NameBlock>
                      <DoctorName>
                        {t('doctorPrefix')} {doctor.firstName} {doctor.lastName}
                      </DoctorName>
                      <SpecialtyText>
                        {tSearch(`specialties.${doctor.specialty}`)}
                      </SpecialtyText>
                    </NameBlock>
                    <IconRoundButton
                      type="button"
                      aria-label={doctor.isFavourite ? t('unfavorite') : t('favorite')}
                      onClick={handleFavourite}
                    >
                      {doctor.isFavourite && isPatient ? (
                        <IconHeartFilled size={20} />
                      ) : (
                        <IconHeart size={20} />
                      )}
                    </IconRoundButton>
                  </NameRow>
                  <ClinicBlock>
                    <FieldLabel>{t('clinic')}</FieldLabel>
                    <ClinicLine>
                      {[clinicName, cityName].filter(Boolean).join(' · ')}
                    </ClinicLine>
                    <AddressLine>{doctor.address}</AddressLine>
                  </ClinicBlock>
                </IdentityMain>
              </IdentityRow>

              <FactsRow>
                <FactCell>
                  <FieldLabel>{t('experience')}</FieldLabel>
                  <FactValue>
                    {t(experienceKey(doctor.yearsPractice, i18n.language), {
                      count: doctor.yearsPractice,
                    })}
                  </FactValue>
                </FactCell>
                <FactCell>
                  <FieldLabel>{t('format')}</FieldLabel>
                  <FactValue>{formatLabel(doctor.supportedFormats, t)}</FactValue>
                </FactCell>
                <FactCell>
                  <FieldLabel>{t('languages')}</FieldLabel>
                  <FactValue>
                    {doctor.languages
                      .map((lang) => (lang === 'uk' ? t('langUk') : t('langEn')))
                      .join(', ')}
                  </FactValue>
                </FactCell>
              </FactsRow>

              <BioBlock>
                <FieldLabel>{t('about')}</FieldLabel>
                <BioText>
                  {pickLocalizedDescription(
                    doctor.descriptionUk,
                    doctor.descriptionEn,
                    i18n.language,
                  )}
                </BioText>
              </BioBlock>

              <PriceRatingRow>
                <PriceBlock>
                  <FieldLabel>{t('consultation')}</FieldLabel>
                  <PriceRow>
                    <Price>{doctor.promoPrice ?? doctor.basePrice} ₴</Price>
                    {doctor.promoPrice !== null ? (
                      <StruckPrice>{doctor.basePrice} ₴</StruckPrice>
                    ) : null}
                  </PriceRow>
                </PriceBlock>
                <RatingBlock>
                  <RatingValueRow>
                    <IconStarFilled size={18} aria-hidden />
                    <RatingNumber>{doctor.ratingAverage.toFixed(1)}</RatingNumber>
                  </RatingValueRow>
                  <ReviewCount>
                    {t(reviewCountKey(doctor.reviewCount, i18n.language), {
                      count: doctor.reviewCount,
                    })}
                  </ReviewCount>
                </RatingBlock>
              </PriceRatingRow>

              <ReviewsSection>
                <ReviewsHeader>
                  <ReviewsTitle>{t('reviews')}</ReviewsTitle>
                  <ReviewCount>
                    {t(reviewCountKey(doctor.reviewCount, i18n.language), {
                      count: doctor.reviewCount,
                    })}
                  </ReviewCount>
                </ReviewsHeader>
                {doctor.reviews.map((review) => (
                  <ReviewItem key={review.id}>
                    <ReviewItemHeader>
                      <ReviewAuthor>{review.patientDisplayName}</ReviewAuthor>
                      <ReviewStars>
                        <IconStarFilled size={14} aria-hidden />
                        <ReviewScore>{review.rating.toFixed(1)}</ReviewScore>
                      </ReviewStars>
                    </ReviewItemHeader>
                    <ReviewText>{review.text}</ReviewText>
                  </ReviewItem>
                ))}
              </ReviewsSection>
            </DialogBody>

            <DialogFooter>
              <Button variant="outlined" color="inherit" onClick={closeAndGoHome}>
                {t('back')}
              </Button>
              <Button variant="contained" color="primary" onClick={handleChooseTime}>
                {t('chooseTime')} →
              </Button>
            </DialogFooter>
          </>
        ) : null}

        {doctor && step === 'calendar' ? (
          <>
            <CalendarStep
              calendar={calendarQuery.data}
              isLoading={calendarQuery.isLoading}
              isSlotsLoading={
                calendarQuery.isFetching && Boolean(calendarQuery.isPlaceholderData)
              }
              selectedDate={selectedDate || calendarQuery.data?.zoneAStart || ''}
              selectedStartAt={selectedStartAt}
              format={visitFormat}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedStartAt(null);
              }}
              onSelectSlot={setSelectedStartAt}
              onFormatChange={setVisitFormat}
            />
            <DialogFooter>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setStep('profile');
                }}
              >
                {t('back')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedStartAt}
                onClick={handleContinueFromCalendar}
              >
                {t('calendar.continue')} →
              </Button>
            </DialogFooter>
          </>
        ) : null}

        {doctor && step === 'confirm' && selection ? (
          <>
            <ConfirmStep
              selection={selection}
              clinicName={clinicName}
              cityName={cityName}
              address={doctor.address}
              errorMessage={confirmError}
              formId={CONFIRM_FORM_ID}
              onPickAnother={() => {
                setConfirmError(null);
                setSelectedStartAt(null);
                setStep('calendar');
              }}
              onSubmit={(reason) => {
                void handleConfirm(reason);
              }}
            />
            <DialogFooter>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setConfirmError(null);
                  setStep('calendar');
                }}
              >
                {t('back')}
              </Button>
              <Button
                type="submit"
                form={CONFIRM_FORM_ID}
                variant="contained"
                color="primary"
                disabled={bookMutation.isPending}
              >
                {bookMutation.isPending ? t('confirm.submitting') : t('confirm.submit')}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogShell>
    </ProfileDialog>
  );
};
