import {
  getPendingDecision as generatedGetPendingDecision,
  postAcceptProposal as generatedPostAcceptProposal,
  postBookAppointment as generatedPostBookAppointment,
  postCancelAppointment as generatedPostCancelAppointment,
  postCompleteAppointment as generatedPostCompleteAppointment,
  postRescheduleAppointment as generatedPostRescheduleAppointment,
} from '@/api/generated/appointments/appointments';
import type {
  AppointmentDto,
  BookAppointmentBody,
  BookAppointmentResponse,
  PendingDecisionResponse,
  RescheduleAppointmentBody,
  RescheduleAppointmentResponse,
} from '@/api/appointments/types';

/** POST /api/v1/appointments */
export const postBookAppointment = (body: BookAppointmentBody) => {
  return generatedPostBookAppointment(body) as Promise<BookAppointmentResponse>;
};

/** POST /api/v1/appointments/:id/reschedule */
export const postRescheduleAppointment = (id: string, body: RescheduleAppointmentBody) => {
  return generatedPostRescheduleAppointment(
    id,
    body,
  ) as Promise<RescheduleAppointmentResponse>;
};

/** POST /api/v1/appointments/:id/cancel */
export const postCancelAppointment = async (id: string): Promise<AppointmentDto> => {
  const data = await generatedPostCancelAppointment(id);
  return data.appointment as AppointmentDto;
};

/** POST /api/v1/appointments/:id/complete */
export const postCompleteAppointment = async (id: string): Promise<AppointmentDto> => {
  const data = await generatedPostCompleteAppointment(id);
  return data.appointment as AppointmentDto;
};

/** GET /api/v1/appointments/:id/pending-decision */
export const getPendingDecision = (id: string) => {
  return generatedGetPendingDecision(id) as Promise<PendingDecisionResponse>;
};

/** POST /api/v1/appointments/:id/accept-proposal */
export const postAcceptProposal = (id: string) => {
  return generatedPostAcceptProposal(id) as Promise<RescheduleAppointmentResponse>;
};
