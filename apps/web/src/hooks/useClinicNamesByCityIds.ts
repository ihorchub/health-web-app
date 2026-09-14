import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getReferenceClinics } from '@/api/reference/reference';
import { referenceQueryKeys } from '@/api/reference/reference.hooks';
import type { ReferenceCity } from '@/api/reference/types';

/** Resolve clinic names for doctor cards across multiple cities (live reference). */
export const useClinicNamesByCityIds = (cityIds: string[]) => {
  const uniqueCityIds = useMemo(
    () => Array.from(new Set(cityIds.filter(Boolean))).sort(),
    [cityIds],
  );

  const queries = useQueries({
    queries: uniqueCityIds.map((cityId) => ({
      queryKey: referenceQueryKeys.clinics(cityId),
      queryFn: () => getReferenceClinics(cityId),
      staleTime: 5 * 60_000,
    })),
  });

  const clinicNameById: Record<string, string> = {};
  for (const query of queries) {
    for (const clinic of query.data?.items ?? []) {
      clinicNameById[clinic.id] = clinic.name;
    }
  }
  return clinicNameById;
};

export const cityNameMap = (cities: ReferenceCity[]): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const city of cities) {
    map[city.id] = city.name;
  }
  return map;
};
