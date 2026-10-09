import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  postAcceptProposal,
  postBookAppointment,
  postCancelAppointment,
  postCompleteAppointment,
  postRescheduleAppointment,
} from '@/api/appointments/appointments';
import type {
  AppointmentDto,
  BookAppointmentBody,
  BookAppointmentResponse,
  RescheduleAppointmentBody,
  RescheduleAppointmentResponse,
} from '@/api/appointments/types';
import { doctorsQueryKeys } from '@/api/doctors/doctors.hooks';
import { patientsQueryKeys } from '@/api/patients/patients.hooks';

/** POST /api/v1/appointments */
export const usePostBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<BookAppointmentResponse, Error, BookAppointmentBody>({
    mutationFn: (body) => postBookAppointment(body),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['doctors', variables.doctorId, 'calendar'],
      });
      void queryClient.invalidateQueries({
        queryKey: doctorsQueryKeys.byId(variables.doctorId, 'patient'),
      });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/** POST /api/v1/appointments/:id/reschedule */
export const usePostRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RescheduleAppointmentResponse,
    Error,
    { id: string; body: RescheduleAppointmentBody }
  >({
    mutationFn: ({ id, body }) => postRescheduleAppointment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: ['doctors'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/** POST /api/v1/appointments/:id/complete */
export const usePostCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, Error, { id: string }>({
    mutationFn: ({ id }) => postCompleteAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
    },
  });
};

/** POST /api/v1/appointments/:id/cancel (patient or doctor) */
export const usePostCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, Error, { id: string }>({
    mutationFn: ({ id }) => postCancelAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['doctors', 'me', 'dashboard'] });
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/** POST /api/v1/appointments/:id/accept-proposal */
export const usePostAcceptProposal = () => {
  const queryClient = useQueryClient();

  return useMutation<RescheduleAppointmentResponse, Error, { id: string }>({
    mutationFn: ({ id }) => postAcceptProposal(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientsQueryKeys.cabinet() });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export type {
  AppointmentDto,
  AppointmentFormat,
  BookAppointmentBody,
  BookAppointmentResponse,
  PendingDecisionResponse,
  RescheduleAppointmentBody,
  RescheduleAppointmentResponse,
} from '@/api/appointments/types';
