import { IconChevronDown, IconChevronUp, IconHeart, IconStarFilled, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
  FavouriteButton,
  PreviewAddress,
  PreviewBioBlock,
  PreviewBioText,
  PreviewBody,
  PreviewEducation,
  PreviewEducationList,
  PreviewEducationRow,
  PreviewEducationSubtitle,
  PreviewEducationText,
  PreviewEducationTitle,
  PreviewEducationYears,
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
  EduThumb,
  EduThumbLink,
  ReviewsExpandButton,
  StarAccent,
} from '@/modules/profile/styles';
import type { DoctorEducationItem, DoctorProfileData } from '@/modules/profile/types';
import { resolveMediaUrl } from '@/utils/mediaUrl';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

const formatEducationYears = (item: DoctorEducationItem) => item.years;

const REVIEWS_PREVIEW_COUNT = 3;

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
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

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
          <DoctorPhoto
            photoUrl={profile.photoUrl}
            firstName={profile.firstName}
            lastName={profile.lastName}
            size="xl"
            shape="rounded"
          />
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

        {profile.education.length > 0 ? (
          <PreviewEducation>
            <PreviewMutedOverline>{t('preview.education')}</PreviewMutedOverline>
            <PreviewEducationList>
              {profile.education.map((item) => {
                const imageSrc = resolveMediaUrl(item.imageUrl || item.previewUrl);
                return (
                  <PreviewEducationRow key={item.id}>
                    <PreviewEducationText>
                      <PreviewEducationTitle>{item.title}</PreviewEducationTitle>
                      {item.subtitle ? (
                        <PreviewEducationSubtitle>{item.subtitle}</PreviewEducationSubtitle>
                      ) : null}
                    </PreviewEducationText>
                    {imageSrc ? (
                      <EduThumbLink
                        href={imageSrc}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('preview.educationOpenPhoto')}
                      >
                        <EduThumb src={imageSrc} alt={t('preview.educationPhotoAlt')} />
                      </EduThumbLink>
                    ) : null}
                    <PreviewEducationYears>{formatEducationYears(item)}</PreviewEducationYears>
                  </PreviewEducationRow>
                );
              })}
            </PreviewEducationList>
          </PreviewEducation>
        ) : null}

        <PreviewPriceRating>
          <PreviewPriceBlock>
            <PreviewOverline>{t('preview.consultation')}</PreviewOverline>
            <PreviewPriceRow>
              <PreviewPrice $promo={profile.promoPrice != null}>
                {t('preview.price', { amount: displayPrice })}
              </PreviewPrice>
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
          {(reviewsExpanded
            ? profile.reviews
            : profile.reviews.slice(0, REVIEWS_PREVIEW_COUNT)
          ).map((review) => (
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
          {profile.reviews.length > REVIEWS_PREVIEW_COUNT ? (
            <ReviewsExpandButton
              type="button"
              onClick={() => {
                setReviewsExpanded((open) => !open);
              }}
            >
              {reviewsExpanded ? (
                <>
                  {t('reviews.showLess')}
                  <IconChevronUp size={16} stroke={1.75} aria-hidden />
                </>
              ) : (
                <>
                  {t('reviews.showMore', {
                    count: profile.reviews.length - REVIEWS_PREVIEW_COUNT,
                  })}
                  <IconChevronDown size={16} stroke={1.75} aria-hidden />
                </>
              )}
            </ReviewsExpandButton>
          ) : null}
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
