import { useQuery } from '@tanstack/react-query';

import type {
  DoctorProfile,
  DoctorsSearchParams,
  DoctorsSearchResponse,
} from '@/api/doctors/types';
import { mockGetDoctorById, mockSearchDoctors } from '@/api/mocks/doctorsSearch';

export const doctorsQueryKeys = {
  search: (params: DoctorsSearchParams, roleKey: string) =>
    ['doctors', 'search', roleKey, params] as const,
  byId: (doctorId: string, roleKey: string) => ['doctors', doctorId, roleKey] as const,
};

interface UseGetDoctorsSearchOptions {
  isPatient?: boolean;
  homeClinicId?: string | null;
  enabled?: boolean;
}

/** Orval-shaped — mocked until OpenAPI lands. */
export const useGetDoctorsSearch = (
  params: DoctorsSearchParams,
  options: UseGetDoctorsSearchOptions = {},
) => {
  const roleKey = options.isPatient ? 'patient' : 'guest';

  return useQuery<DoctorsSearchResponse>({
    queryKey: doctorsQueryKeys.search(params, roleKey),
    queryFn: () =>
      mockSearchDoctors(params, {
        isPatient: options.isPatient,
        homeClinicId: options.homeClinicId,
      }),
    enabled: options.enabled ?? true,
    placeholderData: (previous) => previous,
  });
};

interface UseGetDoctorByIdOptions {
  isPatient?: boolean;
  enabled?: boolean;
}

/** Orval-shaped — GET /api/v1/doctors/:doctorId */
export const useGetDoctorById = (
  doctorId: string | undefined,
  options: UseGetDoctorByIdOptions = {},
) => {
  const roleKey = options.isPatient ? 'patient' : 'guest';

  return useQuery<DoctorProfile>({
    queryKey: doctorsQueryKeys.byId(doctorId ?? '', roleKey),
    queryFn: () => mockGetDoctorById(doctorId!, { isPatient: options.isPatient }),
    enabled: Boolean(doctorId) && (options.enabled ?? true),
  });
};

export type {
  DoctorsSearchParams,
  DoctorsSearchResponse,
  DoctorSearchCard,
  DoctorProfile,
  DoctorReview,
} from '@/api/doctors/types';
