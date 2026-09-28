import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  BookButton,
  CardActions,
  CardIdentity,
  CardTop,
  ClinicText,
  DoctorCardRoot,
  DoctorName,
  HeartButton,
  LinkishButton,
  NameRow,
  Price,
  PriceRow,
  PromoBadge,
  SpecialtyText,
  StruckPrice,
} from '@/modules/search/styles';
import {
  CarouselTrack,
  SectionHead,
  SectionLink,
  SectionTitle,
} from '@/modules/patient-room/styles';
import type { CabinetDoctorCard } from '@/modules/patient-room/types';

interface DoctorCarouselSectionProps {
  title: string;
  linkLabel?: string;
  onLink?: () => void;
  doctors: CabinetDoctorCard[];
  favouriteIds?: ReadonlySet<string>;
  onOpenProfile: (doctor: CabinetDoctorCard) => void;
  onBook: (doctor: CabinetDoctorCard) => void;
  onFavourite: (doctor: CabinetDoctorCard) => void;
  onViewHours: (doctor: CabinetDoctorCard) => void;
}

export const DoctorCarouselSection = ({
  title,
  linkLabel,
  onLink,
  doctors,
  favouriteIds,
  onOpenProfile,
  onBook,
  onFavourite,
  onViewHours,
}: DoctorCarouselSectionProps) => {
  const { t } = useTranslation('search');

  return (
    <section>
      <SectionHead>
        <SectionTitle>{title}</SectionTitle>
        {linkLabel && onLink ? (
          <SectionLink type="button" onClick={onLink}>
            {linkLabel}
          </SectionLink>
        ) : null}
      </SectionHead>

      <CarouselTrack>
        {doctors.map((doctor) => {
          const isFavourite = favouriteIds?.has(doctor.id) ?? false;
          const displayPrice = doctor.promoPrice ?? doctor.basePrice;
          const place = [doctor.clinicName, doctor.cityName].filter(Boolean).join(', ');
          const specialty = t(`specialties.${doctor.specialty}`, {
            defaultValue: doctor.specialty,
          });

          return (
            <DoctorCardRoot
              key={doctor.id}
              role="link"
              tabIndex={0}
              onClick={() => {
                onOpenProfile(doctor);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenProfile(doctor);
                }
              }}
            >
              <CardTop>
                <Avatar src={doctor.photoUrl ?? undefined} alt="" />
                <CardIdentity>
                  <NameRow>
                    <DoctorName>
                      {doctor.firstName} {doctor.lastName}
                    </DoctorName>
                    <HeartButton
                      type="button"
                      aria-label={isFavourite ? t('card.unfavorite') : t('card.favorite')}
                      onClick={(event) => {
                        event.stopPropagation();
                        onFavourite(doctor);
                      }}
                    >
                      {isFavourite ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                    </HeartButton>
                  </NameRow>
                  <SpecialtyText>{specialty}</SpecialtyText>
                  {place ? <ClinicText>{place}</ClinicText> : null}
                </CardIdentity>
              </CardTop>

              <PriceRow>
                <Price>{displayPrice} ₴</Price>
                {doctor.promoPrice !== null ? (
                  <>
                    <StruckPrice>{doctor.basePrice} ₴</StruckPrice>
                    <PromoBadge>{t('card.promo')}</PromoBadge>
                  </>
                ) : null}
              </PriceRow>

              <CardActions>
                <BookButton
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    onBook(doctor);
                  }}
                >
                  {t('card.book')}
                </BookButton>
                <LinkishButton
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onViewHours(doctor);
                  }}
                >
                  {t('card.viewHours')}
                </LinkishButton>
              </CardActions>
            </DoctorCardRoot>
          );
        })}
      </CarouselTrack>
    </section>
  );
};
