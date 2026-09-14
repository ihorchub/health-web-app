import { useQuery } from '@tanstack/react-query';

import {
  getReferenceCities,
  getReferenceClinics,
  getReferenceSpecialties,
} from '@/api/reference/reference';

export const referenceQueryKeys = {
  cities: ['reference', 'cities'] as const,
  clinics: (cityId: string) => ['reference', 'clinics', cityId] as const,
  specialties: ['reference', 'specialties'] as const,
};

export const useGetReferenceCities = () => {
  return useQuery({
    queryKey: referenceQueryKeys.cities,
    queryFn: getReferenceCities,
    staleTime: 5 * 60_000,
  });
};

export const useGetReferenceClinics = (cityId: string | undefined) => {
  return useQuery({
    queryKey: referenceQueryKeys.clinics(cityId ?? ''),
    queryFn: () => getReferenceClinics(cityId!),
    enabled: Boolean(cityId),
    staleTime: 5 * 60_000,
  });
};

export const useGetReferenceSpecialties = () => {
  return useQuery({
    queryKey: referenceQueryKeys.specialties,
    queryFn: getReferenceSpecialties,
    staleTime: 5 * 60_000,
  });
};
