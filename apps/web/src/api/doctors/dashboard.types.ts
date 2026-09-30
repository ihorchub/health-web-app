import type { AppointmentFormat, AppointmentStatus } from '@/api/appointments/types';

/** GET /api/v1/doctors/me/dashboard?date= — SCR-08 (matches live API). */

export interface DoctorDashboardMetrics {
  visitsToday: number;
  pendingCount: number;
  freeSlotsToday: number;
  cancellationsLast7Days: number;
  pastVisitsThisMonth: number;
}

export interface DoctorDashboardVisit {
  id: string;
  patientDisplayName: string;
  patientPhotoUrl: string | null;
  startAt: string;
  format: AppointmentFormat;
  reason: string | null;
  status: AppointmentStatus | string;
  proposedStartAt: string | null;
}

export interface DoctorDashboardWeekStripDay {
  date: string;
  visits: number;
  pending: number;
  cancelled: number;
  free: number;
}

export interface DoctorDashboardResponse {
  date: string;
  metrics: DoctorDashboardMetrics;
  visits: DoctorDashboardVisit[];
  nextVisit: DoctorDashboardVisit | null;
  pendingPatients: DoctorDashboardVisit[];
  pastVisitsMonth: DoctorDashboardVisit[];
  /** Free slot start times (ISO) for the requested day. */
  freeWindowsToday: string[];
  /** Mon–Sun status counts for the week containing `date`. */
  weekStrip: DoctorDashboardWeekStripDay[];
}

export interface DoctorDashboardParams {
  date: string;
}
