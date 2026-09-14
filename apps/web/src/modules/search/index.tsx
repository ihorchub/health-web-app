import { Button } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetDoctorsSearch, type SearchSort } from '@/api/doctors';
import {
  useGetReferenceCities,
  useGetReferenceClinics,
  useGetReferenceSpecialties,
} from '@/api/reference';
import { useAppRole } from '@/hooks/useAppRole';
import { cityNameMap, useClinicNamesByCityIds } from '@/hooks/useClinicNamesByCityIds';
import { DoctorsSection } from '@/modules/search/components/DoctorsSection';
import {
  FilterPanel,
  type SearchFiltersState,
} from '@/modules/search/components/FilterPanel';
import { PopularChips } from '@/modules/search/components/PopularChips';
import { SearchBarSection } from '@/modules/search/components/SearchBarSection';
import { SearchHero } from '@/modules/search/components/SearchHero';
import { SpecialtySection } from '@/modules/search/components/SpecialtySection';
import {
  Content,
  ContentRow,
  FiltersDrawer,
  LeftColumn,
  Page,
} from '@/modules/search/styles';
import { AppRole } from '@/types/role';

const DEFAULT_FILTERS: SearchFiltersState = {
  cityId: '',
  clinicId: '',
  specialty: '',
  format: undefined,
  availability: undefined,
  minRating: undefined,
  priceMin: 0,
  priceMax: 5000,
};

const PATIENT_PREFILL: SearchFiltersState = {
  ...DEFAULT_FILTERS,
  cityId: 'city_kyiv',
  clinicId: 'clinic_kyiv_center',
};

const PAGE_SIZE = 6;

export const SearchPage = () => {
  const { t } = useTranslation('search');
  const { role, isSession } = useAppRole();
  const isPatient = role === AppRole.PATIENT && isSession;

  const [queryInput, setQueryInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [guestFilters, setGuestFilters] = useState<SearchFiltersState>(DEFAULT_FILTERS);
  const [patientFilters, setPatientFilters] =
    useState<SearchFiltersState>(PATIENT_PREFILL);
  const [sort, setSort] = useState<SearchSort>('rating');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [specialtiesExpanded, setSpecialtiesExpanded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = isPatient ? patientFilters : guestFilters;
  const setFilters = isPatient ? setPatientFilters : setGuestFilters;

  const citiesQuery = useGetReferenceCities();
  const specialtiesQuery = useGetReferenceSpecialties();
  const clinicsQuery = useGetReferenceClinics(filters.cityId || undefined);

  const searchParams = useMemo(
    () => ({
      q: appliedQuery || undefined,
      cityId: filters.cityId || undefined,
      clinicId: filters.clinicId || undefined,
      specialty: filters.specialty || undefined,
      format: filters.format,
      availability: filters.availability,
      minRating: filters.minRating,
      priceMin: filters.priceMin > 0 ? filters.priceMin : undefined,
      priceMax: filters.priceMax < 5000 ? filters.priceMax : undefined,
      sort,
      limit,
    }),
    [appliedQuery, filters, limit, sort],
  );

  const doctorsQuery = useGetDoctorsSearch(searchParams, {
    isPatient,
    homeClinicId: isPatient ? 'clinic_kyiv_center' : null,
  });

  const doctorCityIds = useMemo(
    () => (doctorsQuery.data?.items ?? []).map((doctor) => doctor.cityId),
    [doctorsQuery.data?.items],
  );
  const cityNameById = useMemo(
    () => cityNameMap(citiesQuery.data?.items ?? []),
    [citiesQuery.data?.items],
  );
  const clinicNameById = useClinicNamesByCityIds(doctorCityIds);

  const updateFilters = (next: Partial<SearchFiltersState>) => {
    setFilters((current) => ({ ...current, ...next }));
    setLimit(PAGE_SIZE);
  };

  const resetFilters = () => {
    setFilters(isPatient ? PATIENT_PREFILL : DEFAULT_FILTERS);
    setAppliedQuery('');
    setQueryInput('');
    setLimit(PAGE_SIZE);
  };

  const applyQuery = (value: string) => {
    setAppliedQuery(value.trim());
    setLimit(PAGE_SIZE);
  };

  const changeSort = (next: SearchSort) => {
    setSort(next);
    setLimit(PAGE_SIZE);
  };

  return (
    <Page>
      <Content>
        <SearchHero />

        <SearchBarSection
          value={queryInput}
          onChange={setQueryInput}
          onSubmit={() => {
            applyQuery(queryInput);
          }}
          onOpenFilters={() => {
            setFiltersOpen(true);
          }}
        />

        <PopularChips
          activeSpecialty={filters.specialty || undefined}
          activeQuery={appliedQuery || undefined}
          onSelect={({ specialty, q }) => {
            if (specialty) {
              updateFilters({ specialty });
              setAppliedQuery('');
              setQueryInput('');
            } else if (q) {
              updateFilters({ specialty: '' });
              applyQuery(q);
              setQueryInput(q);
            }
          }}
        />

        <SpecialtySection
          specialties={specialtiesQuery.data?.items ?? []}
          activeSpecialty={filters.specialty || undefined}
          expanded={specialtiesExpanded}
          onToggleExpand={() => {
            setSpecialtiesExpanded((value) => !value);
          }}
          onSelect={(specialtyId) => {
            updateFilters({ specialty: specialtyId ?? '' });
          }}
        />

        <ContentRow>
          <LeftColumn>
            <DoctorsSection
              role={role}
              items={doctorsQuery.data?.items ?? []}
              total={doctorsQuery.data?.total ?? 0}
              sort={sort}
              cityNameById={cityNameById}
              clinicNameById={clinicNameById}
              isLoading={doctorsQuery.isLoading || doctorsQuery.isFetching}
              isError={doctorsQuery.isError}
              hasMore={Boolean(doctorsQuery.data?.nextCursor)}
              onSortChange={changeSort}
              onShowMore={() => {
                setLimit((value) => value + PAGE_SIZE);
              }}
              onRetry={() => {
                void doctorsQuery.refetch();
              }}
            />
          </LeftColumn>

          <FilterPanel
            filters={filters}
            cities={citiesQuery.data?.items ?? []}
            clinics={clinicsQuery.data?.items ?? []}
            specialties={specialtiesQuery.data?.items ?? []}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </ContentRow>
      </Content>

      <FiltersDrawer
        anchor="right"
        open={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
        }}
      >
        <FilterPanel
          embedded
          filters={filters}
          cities={citiesQuery.data?.items ?? []}
          clinics={clinicsQuery.data?.items ?? []}
          specialties={specialtiesQuery.data?.items ?? []}
          onChange={updateFilters}
          onReset={resetFilters}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            setFiltersOpen(false);
          }}
        >
          {t('filters.apply')}
        </Button>
      </FiltersDrawer>
    </Page>
  );
};
