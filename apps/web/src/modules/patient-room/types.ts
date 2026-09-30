export type CabinetAppointmentStatus =
  | 'upcoming'
  | 'reschedule_pending'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type VisitFormat = 'offline' | 'online';

export type CancelledBy = 'patient' | 'doctor';

/** UI appointment row — doctor fields come from cabinet API (no mock lookup). */
export interface CabinetAppointment {
  id: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorPhotoUrl: string | null;
  specialty: string;
  clinicName: string;
  cityName: string;
  startsAt: string;
  /** Doctor-proposed time while status is `reschedule_pending`. */
  proposedStartsAt?: string;
  durationMinutes: number;
  status: CabinetAppointmentStatus;
  format: VisitFormat;
  reason?: string;
  cancelledBy?: CancelledBy;
  canMove?: boolean;
  canCancel?: boolean;
  canReview?: boolean;
  hasPatientReview?: boolean;
  patientReviewRating?: number;
  patientReviewText?: string;
}

export interface CabinetDoctorCard {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  cityName: string;
  photoUrl: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
}
