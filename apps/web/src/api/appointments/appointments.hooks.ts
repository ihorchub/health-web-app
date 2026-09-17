import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  AppointmentDto,
  BookAppointmentBody,
  BookAppointmentResponse,
} from '@/api/appointments/types';
import type {
  ProposeAppointmentBody,
  ProposeAppointmentResponse,
} from '@/api/doctors/dashboard.types';
import { doctorsQueryKeys } from '@/api/doctors/doctors.hooks';
import { mockPostBookAppointment } from '@/api/mocks/bookAppointment';
import {
  mockPostCancelAppointment,
  mockPostCompleteAppointment,
  mockPostProposeAppointment,
} from '@/api/mocks/doctorDashboard';

/** Orval-shaped — POST /api/v1/appointments */
export const usePostBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<BookAppointmentResponse, Error, BookAppointmentBody>({
    mutationFn: (body) => mockPostBookAppointment(body),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['doctors', variables.doctorId, 'calendar'],
      });
      void queryClient.invalidateQueries({
        queryKey: doctorsQueryKeys.byId(variables.doctorId, 'patient'),
      });
    },
  });
};

/** Orval-shaped — POST /api/v1/appointments/:id/complete */
export const usePostCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, Error, { id: string }>({
    mutationFn: ({ id }) => mockPostCompleteAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
    },
  });
};

/** Orval-shaped — POST /api/v1/appointments/:id/cancel (doctor one-visit) */
export const usePostCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, Error, { id: string }>({
    mutationFn: ({ id }) => mockPostCancelAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
    },
  });
};

/** Orval-shaped — POST /api/v1/appointments/:id/propose */
export const usePostProposeAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProposeAppointmentResponse,
    Error,
    { id: string; body: ProposeAppointmentBody }
  >({
    mutationFn: ({ id, body }) => mockPostProposeAppointment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
    },
  });
};

export type {
  AppointmentDto,
  AppointmentFormat,
  BookAppointmentBody,
  BookAppointmentResponse,
} from '@/api/appointments/types';

export type {
  ProposeAppointmentBody,
  ProposeAppointmentResponse,
} from '@/api/doctors/dashboard.types';
