import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDoctorMeProfile,
  patchDoctorMeProfile,
  type DoctorMeProfileDto,
  type DoctorMeProfilePatch,
} from '@/api/doctors/me-profile';

export const doctorMeProfileQueryKeys = {
  me: () => ['doctors', 'me', 'profile'] as const,
};

/** GET /api/v1/doctors/me/profile */
export const useGetDoctorMeProfile = (options: { enabled?: boolean } = {}) => {
  return useQuery<DoctorMeProfileDto>({
    queryKey: doctorMeProfileQueryKeys.me(),
    queryFn: () => getDoctorMeProfile(),
    enabled: options.enabled ?? true,
  });
};

/** PATCH /api/v1/doctors/me/profile */
export const usePatchDoctorMeProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DoctorMeProfileDto, Error, DoctorMeProfilePatch>({
    mutationFn: (body) => patchDoctorMeProfile(body),
    onSuccess: (data) => {
      queryClient.setQueryData(doctorMeProfileQueryKeys.me(), data);
      void queryClient.invalidateQueries({ queryKey: doctorMeProfileQueryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export type { DoctorMeProfileDto, DoctorMeProfilePatch } from '@/api/doctors/me-profile';
