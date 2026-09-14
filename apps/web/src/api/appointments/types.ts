/** Appointment DTOs for POST /api/v1/appointments (SCR-05). */

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
  startAt: string;
  endAt: string;
  format: AppointmentFormat;
  status: AppointmentStatus;
  reason: string | null;
  visitDurationMinutes: number;
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
