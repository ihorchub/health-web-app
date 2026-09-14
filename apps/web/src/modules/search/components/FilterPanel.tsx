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
  PriceLabels,
  RatingPill,
  RatingPills,
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
}

export const FilterPanel = ({
  filters,
  cities,
  clinics,
  specialties,
  onChange,
  onReset,
  embedded,
}: FilterPanelProps) => {
  const { t } = useTranslation('search');

  const body = (
    <>
      <FiltersHeader>
        <SectionTitle>{t('filters.title')}</SectionTitle>
        <ResetButton type="button" onClick={onReset}>
          {t('filters.reset')}
        </ResetButton>
      </FiltersHeader>

      <FilterGroup>
        <FilterGroupTitle>{t('filters.city')}</FilterGroupTitle>
        <FilterField
          select
          value={filters.cityId}
          onChange={(event) => {
            onChange({ cityId: event.target.value, clinicId: '' });
          }}
        >
          <FilterMenuItem value="">{t('filters.cityPlaceholder')}</FilterMenuItem>
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
          onChange={(event) => {
            onChange({ clinicId: event.target.value });
          }}
        >
          <FilterMenuItem value="">{t('filters.clinicPlaceholder')}</FilterMenuItem>
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
          onChange={(event) => {
            onChange({ specialty: event.target.value });
          }}
        >
          <FilterMenuItem value="">{t('filters.specialtyPlaceholder')}</FilterMenuItem>
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
        <RatingPills>
          {[4, 4.5, 3].map((value) => (
            <RatingPill
              key={value}
              type="button"
              $active={filters.minRating === value}
              onClick={() => {
                onChange({ minRating: filters.minRating === value ? undefined : value });
              }}
            >
              <IconStarFilled size={14} />
              {value}+
            </RatingPill>
          ))}
        </RatingPills>
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

  return <Sidebar>{body}</Sidebar>;
};
