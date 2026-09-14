import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  BookAppointmentBody,
  BookAppointmentResponse,
} from '@/api/appointments/types';
import { doctorsQueryKeys } from '@/api/doctors/doctors.hooks';
import { mockPostBookAppointment } from '@/api/mocks/bookAppointment';

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

export type {
  AppointmentDto,
  AppointmentFormat,
  BookAppointmentBody,
  BookAppointmentResponse,
} from '@/api/appointments/types';
