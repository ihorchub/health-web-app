import { IconHeart, IconStarFilled, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  FavouriteButton,
  PreviewAddress,
  PreviewBioBlock,
  PreviewBioText,
  PreviewBody,
  PreviewClinicBlock,
  PreviewClinicName,
  PreviewCloseButton,
  PreviewCloseIcon,
  PreviewDialog,
  PreviewDoctorName,
  PreviewEyebrow,
  PreviewFact,
  PreviewFacts,
  PreviewFactValue,
  PreviewFactValueMedium,
  PreviewFooter,
  PreviewHeader,
  PreviewHeaderText,
  PreviewIdentity,
  PreviewIdentityMain,
  PreviewMutedOverline,
  PreviewNameBlock,
  PreviewNameRow,
  PreviewOverline,
  PreviewPhoto,
  PreviewPrice,
  PreviewPriceBlock,
  PreviewPriceRating,
  PreviewPriceRow,
  PreviewRatingBlock,
  PreviewRatingNumber,
  PreviewRatingRow,
  PreviewReviewAuthor,
  PreviewReviewCount,
  PreviewReviewHeader,
  PreviewReviewItem,
  PreviewReviews,
  PreviewReviewScore,
  PreviewReviewScoreValue,
  PreviewReviewsHeader,
  PreviewReviewsTitle,
  PreviewReviewText,
  PreviewSpecialty,
  PreviewStruckPrice,
  PreviewTitle,
  StarAccent,
} from '@/modules/profile/styles';
import type { DoctorProfileData } from '@/modules/profile/types';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

interface DoctorPreviewDialogProps {
  open: boolean;
  profile: DoctorProfileData;
  onClose: () => void;
}

export const DoctorPreviewDialog = ({
  open,
  profile,
  onClose,
}: DoctorPreviewDialogProps) => {
  const { t, i18n } = useTranslation('profile');

  const shortBio = pickLocalizedDescription(
    profile.shortBioUk,
    profile.shortBioEn,
    i18n.language,
  );

  const formatLabel =
    profile.format === 'both'
      ? t('preview.formatBoth')
      : profile.format === 'online'
        ? t('preview.formatOnline')
        : t('preview.formatOffline');

  const displayPrice = profile.promoPrice ?? profile.basePrice;

  return (
    <PreviewDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <PreviewHeader>
        <PreviewHeaderText>
          <PreviewEyebrow>{t('preview.eyebrow')}</PreviewEyebrow>
          <PreviewTitle>{t('preview.title')}</PreviewTitle>
        </PreviewHeaderText>
        <PreviewCloseIcon type="button" aria-label={t('preview.close')} onClick={onClose}>
          <IconX size={20} stroke={1.75} aria-hidden />
        </PreviewCloseIcon>
      </PreviewHeader>

      <PreviewBody>
        <PreviewIdentity>
          <PreviewPhoto src={profile.photoUrl} alt="" />
          <PreviewIdentityMain>
            <PreviewNameRow>
              <PreviewNameBlock>
                <PreviewDoctorName>
                  {t('preview.drName', {
                    name: `${profile.firstName} ${profile.lastName}`,
                  })}
                </PreviewDoctorName>
                <PreviewSpecialty>{profile.specialtyLabel}</PreviewSpecialty>
              </PreviewNameBlock>
              <FavouriteButton type="button" aria-label={t('preview.favourite')}>
                <IconHeart size={20} stroke={1.75} aria-hidden />
              </FavouriteButton>
            </PreviewNameRow>
            <PreviewClinicBlock>
              <PreviewOverline>{t('preview.clinic')}</PreviewOverline>
              <PreviewClinicName>
                {profile.clinicName} · {profile.cityName}
              </PreviewClinicName>
              <PreviewAddress>{profile.address}</PreviewAddress>
            </PreviewClinicBlock>
          </PreviewIdentityMain>
        </PreviewIdentity>

        <PreviewFacts>
          <PreviewFact>
            <PreviewOverline>{t('preview.experience')}</PreviewOverline>
            <PreviewFactValue>
              {t('fields.experienceYears', { years: profile.yearsPractice })}
            </PreviewFactValue>
          </PreviewFact>
          <PreviewFact>
            <PreviewOverline>{t('preview.format')}</PreviewOverline>
            <PreviewFactValue>{formatLabel}</PreviewFactValue>
          </PreviewFact>
          <PreviewFact>
            <PreviewMutedOverline>{t('preview.languages')}</PreviewMutedOverline>
            <PreviewFactValueMedium>{profile.languages}</PreviewFactValueMedium>
          </PreviewFact>
        </PreviewFacts>

        <PreviewBioBlock>
          <PreviewMutedOverline>{t('preview.about')}</PreviewMutedOverline>
          <PreviewBioText>{shortBio}</PreviewBioText>
        </PreviewBioBlock>

        <PreviewPriceRating>
          <PreviewPriceBlock>
            <PreviewOverline>{t('preview.consultation')}</PreviewOverline>
            <PreviewPriceRow>
              <PreviewPrice>{t('preview.price', { amount: displayPrice })}</PreviewPrice>
              {profile.promoPrice != null ? (
                <PreviewStruckPrice>
                  {t('preview.price', { amount: profile.basePrice })}
                </PreviewStruckPrice>
              ) : null}
            </PreviewPriceRow>
          </PreviewPriceBlock>
          <PreviewRatingBlock>
            <PreviewRatingRow>
              <StarAccent>
                <IconStarFilled size={18} aria-hidden />
              </StarAccent>
              <PreviewRatingNumber>
                {profile.ratingAverage.toFixed(1)}
              </PreviewRatingNumber>
            </PreviewRatingRow>
            <PreviewReviewCount>
              {t('preview.reviewsCount', { count: profile.reviewCount })}
            </PreviewReviewCount>
          </PreviewRatingBlock>
        </PreviewPriceRating>

        <PreviewReviews>
          <PreviewReviewsHeader>
            <PreviewReviewsTitle>{t('preview.reviews')}</PreviewReviewsTitle>
            <PreviewReviewCount>
              {t('preview.reviewsCount', { count: profile.reviewCount })}
            </PreviewReviewCount>
          </PreviewReviewsHeader>
          {profile.reviews.map((review) => (
            <PreviewReviewItem key={review.id}>
              <PreviewReviewHeader>
                <PreviewReviewAuthor>{review.author}</PreviewReviewAuthor>
                <PreviewReviewScore>
                  <StarAccent>
                    <IconStarFilled size={14} aria-hidden />
                  </StarAccent>
                  <PreviewReviewScoreValue>
                    {review.rating.toFixed(1)}
                  </PreviewReviewScoreValue>
                </PreviewReviewScore>
              </PreviewReviewHeader>
              <PreviewReviewText>{review.text}</PreviewReviewText>
            </PreviewReviewItem>
          ))}
        </PreviewReviews>
      </PreviewBody>

      <PreviewFooter>
        <PreviewCloseButton variant="contained" color="primary" onClick={onClose}>
          {t('preview.close')}
        </PreviewCloseButton>
      </PreviewFooter>
    </PreviewDialog>
  );
};
