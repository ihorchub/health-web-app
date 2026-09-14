import {
  IconChevronDown,
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
} from '@tabler/icons-react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { DoctorSearchCard, SearchSort } from '@/api/doctors';
import {
  Avatar,
  BookButton,
  CardActions,
  CardIdentity,
  CardTop,
  ClinicText,
  DoctorCardRoot,
  DoctorGrid,
  DoctorName,
  DoctorsHeader,
  FormatBadge,
  FoundText,
  HeartButton,
  HintText,
  LinkishButton,
  MetaBlock,
  MetaRow,
  NameRow,
  Price,
  PriceRow,
  PromoBadge,
  RatingRow,
  SectionTitle,
  ShowMoreButton,
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
  StateMascot,
  StateTitle,
  StatusBadge,
  StruckPrice,
  TitleRow,
  FilterMenuItem,
  ResultsWrap,
} from '@/modules/search/styles';
import { AppRole } from '@/types/role';
import { AppRoute, doctorProfilePath } from '@/utils/routeUtils/routes';

const LIKA_EMPTY = '/brand/lika-poses/lika4.png';
const LIKA_ERROR = '/brand/lika-poses/lika5.png';
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
  if (language.startsWith('en')) {
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
  const displayPrice = doctor.promoPrice ?? doctor.basePrice;
  const place = [clinicName, cityName].filter(Boolean).join(', ');

  return (
    <DoctorCardRoot
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
        <Avatar src={doctor.photoUrl} alt="" />
        <CardIdentity>
          <NameRow>
            <DoctorName>
              {doctor.firstName} {doctor.lastName}
            </DoctorName>
            <HeartButton
              type="button"
              aria-label={doctor.isFavourite ? t('card.unfavorite') : t('card.favorite')}
              onClick={(event) => {
                event.stopPropagation();
                onFavourite(doctor);
              }}
            >
              {doctor.isFavourite && !isGuest ? (
                <IconHeartFilled size={20} />
              ) : (
                <IconHeart size={20} />
              )}
            </HeartButton>
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
            <FormatBadge>{t('card.offline')}</FormatBadge>
          )}
          {(doctor.supportedFormats === 'online' ||
            doctor.supportedFormats === 'both') && (
            <FormatBadge>{t('card.online')}</FormatBadge>
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
  isError: boolean;
  hasMore: boolean;
  onSortChange: (sort: SearchSort) => void;
  onShowMore: () => void;
  onRetry: () => void;
}

export const DoctorsSection = ({
  role,
  items,
  total,
  sort,
  cityNameById,
  clinicNameById,
  isLoading,
  isError,
  hasMore,
  onSortChange,
  onShowMore,
  onRetry,
}: DoctorsSectionProps) => {
  const { t, i18n } = useTranslation('search');
  const navigate = useNavigate();

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
    if (role === AppRole.GUEST) {
      goLogin(doctorProfilePath(doctor.id));
      return;
    }
    toast.message(t('card.bookingSoon'), {
      description: `${doctor.firstName} ${doctor.lastName}`,
    });
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

      {isLoading ? (
        <DoctorGrid aria-busy aria-label={t('results.loadingBadge')}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <DoctorCardSkeleton key={index} />
          ))}
        </DoctorGrid>
      ) : null}

      {isError ? (
        <StateBox role="alert">
          <StateMascot src={LIKA_ERROR} alt="" />
          <StateTitle>{t('results.errorTitle')}</StateTitle>
          <StateBody>{t('results.errorBody')}</StateBody>
          <Button variant="contained" color="primary" onClick={onRetry}>
            {t('results.retry')}
          </Button>
        </StateBox>
      ) : null}

      {showEmpty ? (
        <StateBox>
          <StateMascot src={LIKA_EMPTY} alt="" />
          <StateTitle>{t('results.emptyTitle')}</StateTitle>
          <StateBody>{t('results.emptyBody')}</StateBody>
        </StateBox>
      ) : null}

      {showResults ? (
        <>
          <DoctorGrid>
            {items.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                role={role}
                clinicName={clinicNameById[doctor.clinicId] ?? ''}
                cityName={cityNameById[doctor.cityId] ?? ''}
                onOpenProfile={openProfile}
                onBook={handleBook}
                onFavourite={handleFavourite}
                onViewHours={handleViewHours}
              />
            ))}
          </DoctorGrid>

          {hasMore ? (
            <ShowMoreButton
              type="button"
              variant="outlined"
              color="inherit"
              endIcon={<IconChevronDown size={18} />}
              onClick={onShowMore}
            >
              {t('results.showMore')}
            </ShowMoreButton>
          ) : null}
        </>
      ) : null}
    </ResultsWrap>
  );
};
