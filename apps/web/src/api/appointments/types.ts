/** Appointment DTOs for /api/v1/appointments (SCR-05 / SCR-08 / SCR-12). */

export type AppointmentFormat = 'offline' | 'online';

export type AppointmentStatus =
  | 'Upcoming'
  | 'Reschedule Pending'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled';

export interface AppointmentDto {
  id: string;
  doctorId: string;
  patientId?: string;
  startAt: string;
  endAt: string;
  format: AppointmentFormat;
  status: AppointmentStatus;
  reason: string | null;
  visitDurationMinutes: number;
  proposedStartAt?: string | null;
  cancelledBy?: 'patient' | 'doctor' | null;
}

export interface BookAppointmentBody {
  doctorId: string;
  startAt: string;
  format: AppointmentFormat;
  reason?: string;
}

export interface BookAppointmentResponse {
  appointment: AppointmentDto;
}

export interface RescheduleAppointmentBody {
  newStartAt: string;
  format: AppointmentFormat;
  reason?: string;
}

export interface RescheduleAppointmentResponse {
  oldAppointment: AppointmentDto;
  newAppointment: AppointmentDto;
}

export interface PendingDecisionResponse {
  appointmentId: string;
  doctorId: string;
  status: AppointmentStatus;
  originalStartAt: string;
  proposedStartAt: string;
  format: AppointmentFormat;
  durationMinutes: number;
  reason: string | null;
}
