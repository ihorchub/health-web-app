import type { AppointmentFormat, AppointmentStatus } from '@/api/appointments/types';

/** GET /api/v1/doctors/me/dashboard?date= — SCR-08 */

export interface DoctorDashboardMetrics {
  visitsToday: number;
  pendingCount: number;
  freeSlotsToday: number;
  cancellationsLast7Days: number;
}

export interface DoctorDashboardVisit {
  id: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string | null;
  patientEmail: string | null;
  startAt: string;
  endAt: string;
  format: AppointmentFormat;
  status: AppointmentStatus;
  reason: string | null;
  visitDurationMinutes: number;
  cancelledBy: 'patient' | 'doctor' | null;
  /** Present when status is Reschedule Pending */
  proposedStartAt: string | null;
  /**
   * True when this row is the reserved proposed slot (same patient),
   * not the original pending appointment.
   */
  isProposalHold: boolean;
}

export interface DoctorDashboardPendingPatient {
  id: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  originalStartAt: string;
  proposedStartAt: string;
}

export interface DoctorDashboardFreeWindow {
  id: string;
  startAt: string;
  endAt: string;
  slotsCount: number;
}

export interface DoctorDashboardResponse {
  date: string;
  metrics: DoctorDashboardMetrics;
  visits: DoctorDashboardVisit[];
  nextVisit: DoctorDashboardVisit | null;
  pendingPatients: DoctorDashboardPendingPatient[];
  freeWindowsToday: DoctorDashboardFreeWindow[];
  /** Free start times the doctor can propose for this day (Zone A). */
  proposeSlots: string[];
}

export interface DoctorDashboardParams {
  date: string;
}

export interface ProposeAppointmentBody {
  proposedStartAt: string;
  format?: AppointmentFormat;
}

export interface ProposeAppointmentResponse {
  appointment: DoctorDashboardVisit;
  proposalHold: DoctorDashboardVisit;
}
