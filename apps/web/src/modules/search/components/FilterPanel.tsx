import { Checkbox, Slider } from '@mui/material';
import { IconStarFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { AvailabilityFilter, VisitFormat } from '@/api/doctors';
import type { ReferenceCity, ReferenceClinic, ReferenceSpecialty } from '@/api/reference';
import {
  CheckRow,
  FilterField,
  FilterGroup,
  FilterGroupTitle,
  FilterMenuItem,
  FiltersHeader,
  PlaceholderOption,
  PriceLabels,
  RatingOption,
  RatingOptionLabel,
  RatingOptions,
  RatingStar,
  RatingStars,
  ResetButton,
  SectionTitle,
  Sidebar,
} from '@/modules/search/styles';

export interface SearchFiltersState {
  cityId: string;
  clinicId: string;
  specialty: string;
  format?: VisitFormat;
  availability?: AvailabilityFilter;
  minRating?: number;
  priceMin: number;
  priceMax: number;
}

interface FilterPanelProps {
  filters: SearchFiltersState;
  cities: ReferenceCity[];
  clinics: ReferenceClinic[];
  specialties: ReferenceSpecialty[];
  onChange: (next: Partial<SearchFiltersState>) => void;
  onReset: () => void;
  embedded?: boolean;
  showHeader?: boolean;
  heightPx?: number;
}

export const FilterPanel = ({
  filters,
  cities,
  clinics,
  specialties,
  onChange,
  onReset,
  embedded,
  showHeader = true,
  heightPx,
}: FilterPanelProps) => {
  const { t } = useTranslation('search');

  const body = (
    <>
      {showHeader ? (
        <FiltersHeader>
          <SectionTitle>{t('filters.title')}</SectionTitle>
          <ResetButton type="button" onClick={onReset}>
            {t('filters.reset')}
          </ResetButton>
        </FiltersHeader>
      ) : null}

      <FilterGroup>
        <FilterGroupTitle>{t('filters.city')}</FilterGroupTitle>
        <FilterField
          select
          value={filters.cityId}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                const value = String(selected ?? '');
                if (!value) {
                  return (
                    <span className="filter-placeholder">{t('filters.cityPlaceholder')}</span>
                  );
                }
                return cities.find((city) => city.id === value)?.name ?? value;
              },
            },
          }}
          onChange={(event) => {
            onChange({ cityId: event.target.value, clinicId: '' });
          }}
        >
          <FilterMenuItem value="">
            <PlaceholderOption>{t('filters.cityPlaceholder')}</PlaceholderOption>
          </FilterMenuItem>
          {cities.map((city) => (
            <FilterMenuItem key={city.id} value={city.id}>
              {city.name}
            </FilterMenuItem>
          ))}
        </FilterField>

        <FilterGroupTitle>{t('filters.clinic')}</FilterGroupTitle>
        <FilterField
          select
          disabled={!filters.cityId}
          value={filters.clinicId}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                const value = String(selected ?? '');
                if (!value) {
                  return (
                    <span className="filter-placeholder">{t('filters.clinicPlaceholder')}</span>
                  );
                }
                return clinics.find((clinic) => clinic.id === value)?.name ?? value;
              },
            },
          }}
          onChange={(event) => {
            onChange({ clinicId: event.target.value });
          }}
        >
          <FilterMenuItem value="">
            <PlaceholderOption>{t('filters.clinicPlaceholder')}</PlaceholderOption>
          </FilterMenuItem>
          {clinics.map((clinic) => (
            <FilterMenuItem key={clinic.id} value={clinic.id}>
              {clinic.name}
            </FilterMenuItem>
          ))}
        </FilterField>

        <FilterGroupTitle>{t('filters.specialty')}</FilterGroupTitle>
        <FilterField
          select
          value={filters.specialty}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                const value = String(selected ?? '');
                if (!value) {
                  return (
                    <span className="filter-placeholder">
                      {t('filters.specialtyPlaceholder')}
                    </span>
                  );
                }
                return t(`specialties.${value}`, { defaultValue: value });
              },
            },
          }}
          onChange={(event) => {
            onChange({ specialty: event.target.value });
          }}
        >
          <FilterMenuItem value="">
            <PlaceholderOption>{t('filters.specialtyPlaceholder')}</PlaceholderOption>
          </FilterMenuItem>
          {specialties.map((specialty) => (
            <FilterMenuItem key={specialty.id} value={specialty.id}>
              {t(`specialties.${specialty.id}`)}
            </FilterMenuItem>
          ))}
        </FilterField>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filters.format')}</FilterGroupTitle>
        {(
          [
            ['offline', 'filters.formatOffline'],
            ['online', 'filters.formatOnline'],
            ['both', 'filters.formatBoth'],
          ] as const
        ).map(([value, labelKey]) => (
          <CheckRow key={value}>
            <Checkbox
              size="small"
              checked={filters.format === value}
              onChange={(_, checked) => {
                onChange({ format: checked ? value : undefined });
              }}
            />
            {t(labelKey)}
          </CheckRow>
        ))}
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filters.availability')}</FilterGroupTitle>
        {(
          [
            ['today', 'filters.today'],
            ['tomorrow', 'filters.tomorrow'],
            ['this_week', 'filters.thisWeek'],
          ] as const
        ).map(([value, labelKey]) => (
          <CheckRow key={value}>
            <Checkbox
              size="small"
              checked={filters.availability === value}
              onChange={(_, checked) => {
                onChange({ availability: checked ? value : undefined });
              }}
            />
            {t(labelKey)}
          </CheckRow>
        ))}
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filters.rating')}</FilterGroupTitle>
        <RatingOptions>
          {(
            [
              { value: 4.5, filled: 5 },
              { value: 4, filled: 4 },
              { value: 3, filled: 3 },
            ] as const
          ).map(({ value, filled }) => {
            const active = filters.minRating === value;
            return (
              <RatingOption
                key={value}
                type="button"
                $active={active}
                aria-pressed={active}
                onClick={() => {
                  onChange({ minRating: active ? undefined : value });
                }}
              >
                <RatingStars aria-hidden>
                  {Array.from({ length: 5 }, (_, index) => (
                    <RatingStar key={index} $filled={index < filled}>
                      <IconStarFilled size={14} />
                    </RatingStar>
                  ))}
                </RatingStars>
                <RatingOptionLabel>
                  {t('filters.ratingAndUp', { value })}
                </RatingOptionLabel>
              </RatingOption>
            );
          })}
        </RatingOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filters.price')}</FilterGroupTitle>
        <Slider
          value={[filters.priceMin, filters.priceMax]}
          min={0}
          max={5000}
          step={50}
          valueLabelDisplay="off"
          onChange={(_, value) => {
            const [min, max] = value as number[];
            onChange({ priceMin: min, priceMax: max });
          }}
        />
        <PriceLabels>
          <span>{t('filters.priceFrom', { value: filters.priceMin })}</span>
          <span>{t('filters.priceTo', { value: filters.priceMax })}</span>
        </PriceLabels>
      </FilterGroup>
    </>
  );

  if (embedded) {
    return body;
  }

  return <Sidebar $heightPx={heightPx}>{body}</Sidebar>;
};
