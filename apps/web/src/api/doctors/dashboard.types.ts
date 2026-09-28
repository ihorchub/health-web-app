import type { AppointmentFormat, AppointmentStatus } from '@/api/appointments/types';

/** GET /api/v1/doctors/me/dashboard?date= — SCR-08 (matches live API). */

export interface DoctorDashboardMetrics {
  visitsToday: number;
  pendingCount: number;
  freeSlotsToday: number;
  cancellationsLast7Days: number;
}

export interface DoctorDashboardVisit {
  id: string;
  patientDisplayName: string;
  startAt: string;
  format: AppointmentFormat;
  reason: string | null;
  status: AppointmentStatus | string;
  proposedStartAt: string | null;
}

export interface DoctorDashboardResponse {
  date: string;
  metrics: DoctorDashboardMetrics;
  visits: DoctorDashboardVisit[];
  nextVisit: DoctorDashboardVisit | null;
  pendingPatients: DoctorDashboardVisit[];
  /** Free slot start times (ISO) for the requested day. */
  freeWindowsToday: string[];
}

export interface DoctorDashboardParams {
  date: string;
}

export interface ProposeAppointmentBody {
  proposedStartAt: string;
  format?: AppointmentFormat;
}

export interface ProposeAppointmentResponse {
  appointment: {
    id: string;
    doctorId: string;
    patientId: string;
    startAt: string;
    endAt: string;
    format: AppointmentFormat;
    status: AppointmentStatus;
    reason: string | null;
    visitDurationMinutes: number;
    proposedStartAt: string | null;
    cancelledBy: 'patient' | 'doctor' | null;
  };
}
