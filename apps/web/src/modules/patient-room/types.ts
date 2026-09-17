export type CabinetAppointmentStatus =
  | 'upcoming'
  | 'reschedule_pending'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type VisitFormat = 'offline' | 'online';

export type CancelledBy = 'patient' | 'doctor';

export interface CabinetAppointment {
  id: string;
  doctorId: string;
  startsAt: string;
  /** Doctor-proposed time while status is `reschedule_pending`. */
  proposedStartsAt?: string;
  durationMinutes: number;
  status: CabinetAppointmentStatus;
  format: VisitFormat;
  reason?: string;
  cancelledBy?: CancelledBy;
  hasPatientReview?: boolean;
  patientReviewRating?: number;
}
