import { customInstance } from '@/api/mutator/customInstance';
import type {
  AppointmentDto,
  BookAppointmentBody,
  BookAppointmentResponse,
  PendingDecisionResponse,
  RescheduleAppointmentBody,
  RescheduleAppointmentResponse,
} from '@/api/appointments/types';
import type {
  ProposeAppointmentBody,
  ProposeAppointmentResponse,
} from '@/api/doctors/dashboard.types';

/** POST /api/v1/appointments */
export const postBookAppointment = (body: BookAppointmentBody) => {
  return customInstance<BookAppointmentResponse>({
    url: '/v1/appointments',
    method: 'POST',
    data: body,
  });
};

/** POST /api/v1/appointments/:id/reschedule */
export const postRescheduleAppointment = (id: string, body: RescheduleAppointmentBody) => {
  return customInstance<RescheduleAppointmentResponse>({
    url: `/v1/appointments/${encodeURIComponent(id)}/reschedule`,
    method: 'POST',
    data: body,
  });
};

/** POST /api/v1/appointments/:id/cancel */
export const postCancelAppointment = async (id: string): Promise<AppointmentDto> => {
  const data = await customInstance<{ appointment: AppointmentDto }>({
    url: `/v1/appointments/${encodeURIComponent(id)}/cancel`,
    method: 'POST',
  });
  return data.appointment;
};

/** POST /api/v1/appointments/:id/complete */
export const postCompleteAppointment = async (id: string): Promise<AppointmentDto> => {
  const data = await customInstance<{ appointment: AppointmentDto }>({
    url: `/v1/appointments/${encodeURIComponent(id)}/complete`,
    method: 'POST',
  });
  return data.appointment;
};

/** POST /api/v1/appointments/:id/propose */
export const postProposeAppointment = (id: string, body: ProposeAppointmentBody) => {
  return customInstance<ProposeAppointmentResponse>({
    url: `/v1/appointments/${encodeURIComponent(id)}/propose`,
    method: 'POST',
    data: body,
  });
};

/** GET /api/v1/appointments/:id/pending-decision */
export const getPendingDecision = (id: string) => {
  return customInstance<PendingDecisionResponse>({
    url: `/v1/appointments/${encodeURIComponent(id)}/pending-decision`,
    method: 'GET',
  });
};

/** POST /api/v1/appointments/:id/accept-proposal */
export const postAcceptProposal = (id: string) => {
  return customInstance<RescheduleAppointmentResponse>({
    url: `/v1/appointments/${encodeURIComponent(id)}/accept-proposal`,
    method: 'POST',
  });
};
