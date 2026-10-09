import {
  IconChevronDown,
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
} from '@tabler/icons-react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { DoctorSearchCard, SearchSort } from '@/api/doctors';
import { useDeleteFavourite, usePostFavourite } from '@/api/patients';
import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import { StateMascot } from '@/components/StateMascot/StateMascot';
import {
  BookButton,
  CardActions,
  CardIdentity,
  CardTop,
  ClinicText,
  ContentRow,
  DoctorCardRoot,
  DoctorGrid,
  DoctorName,
  DoctorsHeader,
  FormatBadge,
  FoundText,
  HeartButton,
  HeartTooltipTarget,
  HintText,
  LinkishButton,
  LeftColumn,
  MetaBlock,
  MetaRow,
  NameRow,
  Price,
  PriceRow,
  PromoBadge,
  RatingRow,
  ResultsWrap,
  SectionTitle,
  ShowMoreButton,
  ShowMoreRow,
  SkeletonBar,
  SkeletonCard,
  SkeletonCircle,
  SkeletonRow,
  SkeletonStack,
  SortSelect,
  SpecialtyText,
  Stars,
  StateBody,
  StateBox,
  StateTitle,
  StatusBadge,
  StruckPrice,
  TitleRow,
  FilterMenuItem,
  LoadingBanner,
} from '@/modules/search/styles';
import { AppRole } from '@/types/role';
import { AppRoute, doctorProfilePath } from '@/utils/routeUtils/routes';

const LIKA_EMPTY = '/brand/lika-poses/lika4.png';
const LIKA_ERROR = '/brand/lika-poses/lika5.png';
const LIKA_LOADING = '/brand/lika-poses/lika3.png';
const SKELETON_COUNT = 6;

const formatNearest = (iso: string | null, locale: string, fallback: string) => {
  if (!iso) {
    return fallback;
  }
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const reviewKey = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return 'card.reviews_one';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'card.reviews_few';
  }
  return 'card.reviews_many';
};

const foundKey = (count: number, language: string) => {
  if (language === 'en') {
    return count === 1 ? 'results.foundOne' : 'results.found';
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return 'results.foundOne';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'results.foundFew';
  }
  return 'results.found';
};

interface DoctorCardProps {
  doctor: DoctorSearchCard;
  role: AppRole;
  clinicName: string;
  cityName: string;
  onOpenProfile: (doctor: DoctorSearchCard) => void;
  onBook: (doctor: DoctorSearchCard) => void;
  onFavourite: (doctor: DoctorSearchCard) => void;
  onViewHours: (doctor: DoctorSearchCard) => void;
}

export const DoctorCard = ({
  doctor,
  role,
  clinicName,
  cityName,
  onOpenProfile,
  onBook,
  onFavourite,
  onViewHours,
}: DoctorCardProps) => {
  const { t, i18n } = useTranslation('search');
  const isGuest = role === AppRole.GUEST;
  const canFavourite = role === AppRole.PATIENT;
  const showFavourite = isGuest || canFavourite;
  const displayPrice = doctor.promoPrice ?? doctor.basePrice;
  const place = [clinicName, cityName].filter(Boolean).join(', ');

  return (
    <DoctorCardRoot
      data-doctor-card
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
            {showFavourite ? (
              isGuest ? (
                <Tooltip title={t('card.favoriteGuestHint')}>
                  <HeartTooltipTarget
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <HeartButton
                      type="button"
                      disabled
                      aria-label={t('card.favoriteGuestHint')}
                    >
                      <IconHeart size={20} />
                    </HeartButton>
                  </HeartTooltipTarget>
                </Tooltip>
              ) : (
                <HeartButton
                  type="button"
                  $active={doctor.isFavourite}
                  aria-label={doctor.isFavourite ? t('card.unfavorite') : t('card.favorite')}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFavourite(doctor);
                  }}
                >
                  {doctor.isFavourite ? (
                    <IconHeartFilled size={20} />
                  ) : (
                    <IconHeart size={20} />
                  )}
                </HeartButton>
              )
            ) : null}
          </NameRow>
          <SpecialtyText>{t(`specialties.${doctor.specialty}`)}</SpecialtyText>
          {place ? <ClinicText>{place}</ClinicText> : null}
        </CardIdentity>
      </CardTop>

      <RatingRow>
        <Stars aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <IconStarFilled
              key={index}
              size={16}
              opacity={index < Math.round(doctor.ratingAverage) ? 1 : 0.25}
            />
          ))}
        </Stars>
        <strong>{doctor.ratingAverage.toFixed(1)}</strong>
        <span>{t(reviewKey(doctor.reviewCount), { count: doctor.reviewCount })}</span>
      </RatingRow>

      <MetaBlock>
        <MetaRow>
          <span>{t('card.visitType')}</span>
          {(doctor.supportedFormats === 'offline' ||
            doctor.supportedFormats === 'both') && (
            <FormatBadge $tone="offline">{t('card.offline')}</FormatBadge>
          )}
          {(doctor.supportedFormats === 'online' ||
            doctor.supportedFormats === 'both') && (
            <FormatBadge $tone="online">{t('card.online')}</FormatBadge>
          )}
        </MetaRow>
        <MetaRow>
          <span>{t('card.nearest')}</span>
          <strong>
            {formatNearest(doctor.nearestFreeAt, i18n.language, t('card.noSlot'))}
          </strong>
        </MetaRow>
      </MetaBlock>

      <PriceRow>
        <Price $promo={doctor.promoPrice !== null}>{displayPrice} ₴</Price>
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
        {isGuest ? <HintText>{t('card.loginHint')}</HintText> : null}
      </CardActions>
    </DoctorCardRoot>
  );
};

const DoctorCardSkeleton = () => (
  <SkeletonCard aria-hidden>
    <SkeletonRow>
      <SkeletonCircle />
      <SkeletonStack>
        <SkeletonBar $width="70%" $height={14} />
        <SkeletonBar $width="45%" $height={12} />
        <SkeletonBar $width="55%" $height={12} />
      </SkeletonStack>
    </SkeletonRow>
    <SkeletonBar $width="50%" />
    <SkeletonBar $width="80%" />
    <SkeletonBar $width="40%" $height={20} />
    <SkeletonBar $width="100%" $height={40} />
  </SkeletonCard>
);

interface DoctorsSectionProps {
  role: AppRole;
  items: DoctorSearchCard[];
  total: number;
  sort: SearchSort;
  cityNameById: Record<string, string>;
  clinicNameById: Record<string, string>;
  isLoading: boolean;
  /** Fetching next page while previous results stay visible. */
  isLoadingMore?: boolean;
  isError: boolean;
  hasMore: boolean;
  onSortChange: (sort: SearchSort) => void;
  onShowMore: () => void;
  onRetry: () => void;
  /** Height locked to sort + 2 doctor card rows (no stretch / no scroll). */
  filtersSlot?: (heightPx?: number) => ReactNode;
}

export const DoctorsSection = ({
  role,
  items,
  total,
  sort,
  cityNameById,
  clinicNameById,
  isLoading,
  isLoadingMore = false,
  isError,
  hasMore,
  onSortChange,
  onShowMore,
  onRetry,
  filtersSlot,
}: DoctorsSectionProps) => {
  const { t, i18n } = useTranslation('search');
  const navigate = useNavigate();
  const postFavouriteMutation = usePostFavourite();
  const deleteFavouriteMutation = useDeleteFavourite();
  const doctorGridRef = useRef<HTMLDivElement>(null);
  const [filtersHeightPx, setFiltersHeightPx] = useState<number | undefined>();

  useLayoutEffect(() => {
    const measure = () => {
      const gridEl = doctorGridRef.current;
      const firstCard = gridEl?.querySelector<HTMLElement>('[data-doctor-card]');
      if (!firstCard || !gridEl) {
        setFiltersHeightPx(undefined);
        return;
      }
      const cardHeight = firstCard.getBoundingClientRect().height;
      const columnGap = Number.parseFloat(getComputedStyle(gridEl).rowGap || '0') || 0;
      // Exactly two card rows + the gap between them (sort stays in the header).
      setFiltersHeightPx(Math.round(cardHeight * 2 + columnGap));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [isLoading, isError, items.length, sort]);

  const openProfile = (doctor: DoctorSearchCard) => {
    void navigate(doctorProfilePath(doctor.id));
  };

  const goLogin = (returnTo: string) => {
    void navigate(`${AppRoute.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleBook = (doctor: DoctorSearchCard) => {
    if (role === AppRole.GUEST) {
      goLogin(doctorProfilePath(doctor.id));
      return;
    }
    openProfile(doctor);
  };

  const handleFavourite = (doctor: DoctorSearchCard) => {
    if (role === AppRole.GUEST || role !== AppRole.PATIENT) {
      return;
    }
    if (doctor.isFavourite) {
      deleteFavouriteMutation.mutate(
        { doctorId: doctor.id },
        {
          onSuccess: () => {
            toast.success(t('card.unfavorite'));
          },
        },
      );
      return;
    }
    postFavouriteMutation.mutate(
      { doctorId: doctor.id },
      {
        onSuccess: () => {
          toast.success(t('card.favorite'));
        },
      },
    );
  };

  const handleViewHours = (doctor: DoctorSearchCard) => {
    openProfile(doctor);
  };

  const showResults = !isLoading && !isError && items.length > 0;
  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <ResultsWrap>
      <DoctorsHeader>
        <div>
          <TitleRow>
            <SectionTitle>{t('results.title')}</SectionTitle>
            {isLoading ? (
              <StatusBadge $tone="loading">{t('results.loadingBadge')}</StatusBadge>
            ) : null}
            {isError ? (
              <StatusBadge $tone="error">{t('results.errorBadge')}</StatusBadge>
            ) : null}
          </TitleRow>
          {!isLoading && !isError ? (
            <FoundText>{t(foundKey(total, i18n.language), { count: total })}</FoundText>
          ) : null}
        </div>
        {!isError ? (
          <SortSelect
            select
            size="small"
            value={sort}
            onChange={(event) => {
              onSortChange(event.target.value as SearchSort);
            }}
            label={t('results.sortLabel')}
            disabled={isLoading}
          >
            <FilterMenuItem value="rating">{t('results.sortRating')}</FilterMenuItem>
            <FilterMenuItem value="nearest_slot">{t('results.sortNearest')}</FilterMenuItem>
          </SortSelect>
        ) : null}
      </DoctorsHeader>

      <ContentRow>
        <LeftColumn>
          {isLoading ? (
            <>
              <LoadingBanner aria-live="polite">
                <StateMascot src={LIKA_LOADING} size={56} />
                <StateBody>{t('results.loadingBody')}</StateBody>
              </LoadingBanner>
              <DoctorGrid aria-busy aria-label={t('results.loadingBadge')}>
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <DoctorCardSkeleton key={index} />
                ))}
              </DoctorGrid>
            </>
          ) : null}

          {isError ? (
            <StateBox role="alert">
              <StateMascot src={LIKA_ERROR} />
              <StateTitle>{t('results.errorTitle')}</StateTitle>
              <StateBody>{t('results.errorBody')}</StateBody>
              <Button variant="contained" color="primary" onClick={onRetry}>
                {t('results.retry')}
              </Button>
            </StateBox>
          ) : null}

          {showEmpty ? (
            <StateBox>
              <StateMascot src={LIKA_EMPTY} />
              <StateTitle>{t('results.emptyTitle')}</StateTitle>
              <StateBody>{t('results.emptyBody')}</StateBody>
            </StateBox>
          ) : null}

          {showResults ? (
            <DoctorGrid ref={doctorGridRef}>
              {items.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  role={role}
                  clinicName={
                    clinicNameById[doctor.clinicId] ?? doctor.clinicName ?? ''
                  }
                  cityName={cityNameById[doctor.cityId] ?? doctor.cityName ?? ''}
                  onOpenProfile={openProfile}
                  onBook={handleBook}
                  onFavourite={handleFavourite}
                  onViewHours={handleViewHours}
                />
              ))}
            </DoctorGrid>
          ) : null}
        </LeftColumn>

        {filtersSlot?.(filtersHeightPx)}
      </ContentRow>

      {showResults && hasMore ? (
        <ShowMoreRow>
          <ShowMoreButton
            type="button"
            variant="outlined"
            color="inherit"
            disabled={isLoadingMore}
            startIcon={
              isLoadingMore ? <CircularProgress size={18} color="inherit" /> : undefined
            }
            endIcon={isLoadingMore ? undefined : <IconChevronDown size={18} />}
            onClick={onShowMore}
          >
            {isLoadingMore ? t('results.loadingBadge') : t('results.showMore')}
          </ShowMoreButton>
        </ShowMoreRow>
      ) : null}
    </ResultsWrap>
  );
};
