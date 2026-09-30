import { IconChevronLeft, IconChevronRight, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
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
  CarouselNavButton,
  CarouselShell,
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

const SCROLL_EDGE_PX = 4;

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
  const { t } = useTranslation(['search', 'cabinet']);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateNav = () => {
    const el = trackRef.current;
    if (!el) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > SCROLL_EDGE_PX);
    setCanNext(maxScroll > SCROLL_EDGE_PX && el.scrollLeft < maxScroll - SCROLL_EDGE_PX);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) {
      return;
    }

    updateNav();
    el.addEventListener('scroll', updateNav, { passive: true });
    const resizeObserver = new ResizeObserver(updateNav);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateNav);
      resizeObserver.disconnect();
    };
  }, [doctors]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) {
      return;
    }

    const card = el.querySelector('article');
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '16') || 16;
    const step = (card?.getBoundingClientRect().width ?? el.clientWidth * 0.4) + gap;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

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

      <CarouselShell $fadeStart={canPrev} $fadeEnd={canNext}>
        <CarouselNavButton
          type="button"
          $side="prev"
          aria-label={t('cabinet:favourites.carouselPrev')}
          disabled={!canPrev}
          onClick={() => {
            scrollByCard(-1);
          }}
        >
          <IconChevronLeft size={20} stroke={1.75} />
        </CarouselNavButton>

        <CarouselTrack ref={trackRef}>
          {doctors.map((doctor) => {
            const isFavourite = favouriteIds?.has(doctor.id) ?? false;
            const displayPrice = doctor.promoPrice ?? doctor.basePrice;
            const place = [doctor.clinicName, doctor.cityName].filter(Boolean).join(', ');
            const specialty = t(`search:specialties.${doctor.specialty}`, {
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
                  <DoctorPhoto
                    photoUrl={doctor.photoUrl}
                    firstName={doctor.firstName}
                    lastName={doctor.lastName}
                    size="md"
                  />
                  <CardIdentity>
                    <NameRow>
                      <DoctorName>
                        {doctor.firstName} {doctor.lastName}
                      </DoctorName>
                      <HeartButton
                        type="button"
                        $active={isFavourite}
                        aria-label={
                          isFavourite ? t('search:card.unfavorite') : t('search:card.favorite')
                        }
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
                  <Price $promo={doctor.promoPrice !== null}>{displayPrice} ₴</Price>
                  {doctor.promoPrice !== null ? (
                    <>
                      <StruckPrice>{doctor.basePrice} ₴</StruckPrice>
                      <PromoBadge>{t('search:card.promo')}</PromoBadge>
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
                    {t('search:card.book')}
                  </BookButton>
                  <LinkishButton
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onViewHours(doctor);
                    }}
                  >
                    {t('search:card.viewHours')}
                  </LinkishButton>
                </CardActions>
              </DoctorCardRoot>
            );
          })}
        </CarouselTrack>

        <CarouselNavButton
          type="button"
          $side="next"
          aria-label={t('cabinet:favourites.carouselNext')}
          disabled={!canNext}
          onClick={() => {
            scrollByCard(1);
          }}
        >
          <IconChevronRight size={20} stroke={1.75} />
        </CarouselNavButton>
      </CarouselShell>
    </section>
  );
};
