import type { CabinetAppointmentRow, CabinetDoctorSummary } from '@/api/patients';
import type {
  CabinetAppointment,
  CabinetAppointmentStatus,
  CabinetDoctorCard,
} from '@/modules/patient-room/types';

const STATUS_MAP: Record<string, CabinetAppointmentStatus> = {
  Upcoming: 'upcoming',
  'Reschedule Pending': 'reschedule_pending',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Rescheduled: 'rescheduled',
};

export const mapCabinetAppointment = (row: CabinetAppointmentRow): CabinetAppointment => ({
  id: row.id,
  doctorId: row.doctorId,
  doctorFirstName: row.doctorFirstName,
  doctorLastName: row.doctorLastName,
  doctorPhotoUrl: row.doctorPhotoUrl ?? null,
  specialty: row.specialty,
  clinicName: row.clinicName,
  cityName: row.cityName,
  startsAt: row.startAt,
  proposedStartsAt: row.proposedStartAt ?? undefined,
  durationMinutes: row.durationMinutes,
  status: STATUS_MAP[row.status] ?? 'upcoming',
  format: row.format,
  reason: row.reason ?? undefined,
  cancelledBy: row.cancelledBy ?? undefined,
  canMove: row.canMove,
  canCancel: row.canCancel,
  canReview: row.canReview,
  hasPatientReview: Boolean(row.existingReview),
  patientReviewRating: row.existingReview?.rating,
  patientReviewText: row.existingReview?.text ?? undefined,
});

export const mapCabinetDoctorCard = (row: CabinetDoctorSummary): CabinetDoctorCard => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  specialty: row.specialty,
  clinicName: row.clinicName,
  cityName: row.cityName,
  photoUrl: row.photoUrl,
  basePrice: row.basePrice,
  promoPrice: row.promoPrice,
  ratingAverage: row.ratingAverage ?? 0,
});

export const doctorDisplayName = (appointment: CabinetAppointment): string =>
  `${appointment.doctorFirstName} ${appointment.doctorLastName}`.trim();
