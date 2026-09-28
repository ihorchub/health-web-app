import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDoctorSchedule,
  patchDoctorSchedule,
  postBulkCancel,
  type BulkCancelBody,
  type BulkCancelResponse,
  type DoctorScheduleResponse,
  type PatchDoctorScheduleBody,
} from '@/api/doctors/schedule';

export const scheduleQueryKeys = {
  me: () => ['doctors', 'me', 'schedule'] as const,
};

/** GET /api/v1/doctors/me/schedule */
export const useGetDoctorSchedule = (options: { enabled?: boolean } = {}) => {
  return useQuery<DoctorScheduleResponse>({
    queryKey: scheduleQueryKeys.me(),
    queryFn: () => getDoctorSchedule(),
    enabled: options.enabled ?? true,
  });
};

/** PATCH /api/v1/doctors/me/schedule */
export const usePatchDoctorSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<DoctorScheduleResponse, Error, PatchDoctorScheduleBody>({
    mutationFn: (body) => patchDoctorSchedule(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
    },
  });
};

/** POST /api/v1/doctors/me/schedule/bulk-cancel */
export const usePostBulkCancel = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkCancelResponse, Error, BulkCancelBody>({
    mutationFn: (body) => postBulkCancel(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export type {
  BulkCancelBody,
  BulkCancelResponse,
  BulkCancelScope,
  DoctorScheduleResponse,
  PatchDoctorScheduleBody,
  WeeklyTemplate,
} from '@/api/doctors/schedule';
