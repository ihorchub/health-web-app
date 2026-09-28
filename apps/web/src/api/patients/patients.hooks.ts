import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteFavourite,
  deleteRecentlyViewed,
  getPatientCabinet,
  getPatientProfile,
  patchPatientProfile,
  postFavourite,
  postRecentlyViewed,
  postReview,
} from '@/api/patients/patients';
import type {
  CreateReviewBody,
  CreateReviewResponse,
  PatientCabinetResponse,
  PatientProfileDto,
  PatientProfilePatch,
} from '@/api/patients/types';

export const patientsQueryKeys = {
  cabinet: () => ['patients', 'me', 'cabinet'] as const,
  profile: () => ['patients', 'me', 'profile'] as const,
  favourites: () => ['patients', 'me', 'favourites'] as const,
  recentlyViewed: () => ['patients', 'me', 'recently-viewed'] as const,
};

interface UseGetPatientCabinetOptions {
  enabled?: boolean;
}

/** GET /api/v1/patients/me/cabinet */
export const useGetPatientCabinet = (options: UseGetPatientCabinetOptions = {}) => {
  return useQuery<PatientCabinetResponse>({
    queryKey: patientsQueryKeys.cabinet(),
    queryFn: () => getPatientCabinet(),
    enabled: options.enabled ?? true,
  });
};

/** GET /api/v1/patients/me/profile */
export const useGetPatientProfile = (options: { enabled?: boolean } = {}) => {
  return useQuery<PatientProfileDto>({
    queryKey: patientsQueryKeys.profile(),
    queryFn: () => getPatientProfile(),
    enabled: options.enabled ?? true,
  });
};

/** PATCH /api/v1/patients/me/profile */
export const usePatchPatientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<PatientProfileDto, Error, PatientProfilePatch>({
    mutationFn: (body) => patchPatientProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.profile() });
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

/** POST /api/v1/reviews */
export const usePostReview = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, Error, CreateReviewBody>({
    mutationFn: (body) => postReview(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
    },
  });
};

/** POST /api/v1/patients/me/favourites/:doctorId */
export const usePostFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, { doctorId: string }>({
    mutationFn: ({ doctorId }) => postFavourite(doctorId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.favourites() });
      void queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

/** DELETE /api/v1/patients/me/favourites/:doctorId */
export const useDeleteFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, { doctorId: string }>({
    mutationFn: ({ doctorId }) => deleteFavourite(doctorId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.favourites() });
      void queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};

/** POST /api/v1/patients/me/recently-viewed/:doctorId */
export const usePostRecentlyViewed = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, { doctorId: string }>({
    mutationFn: ({ doctorId }) => postRecentlyViewed(doctorId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.recentlyViewed() });
    },
  });
};

/** DELETE /api/v1/patients/me/recently-viewed */
export const useClearRecentlyViewed = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, void>({
    mutationFn: () => deleteRecentlyViewed(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.recentlyViewed() });
    },
  });
};

export type {
  CabinetAppointmentRow,
  CabinetDoctorSummary,
  PatientCabinetResponse,
  PatientProfileDto,
  PatientProfilePatch,
} from '@/api/patients/types';
