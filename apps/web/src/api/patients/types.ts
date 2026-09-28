/** Patient cabinet / lists / profile DTOs — live /api/v1/patients/* */

export interface CabinetDoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  cityName: string;
  photoUrl: string | null;
  basePrice: number;
  promoPrice: number | null;
}

export interface CabinetAppointmentRow {
  id: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorPhotoUrl: string | null;
  specialty: string;
  clinicName: string;
  cityName: string;
  startAt: string;
  durationMinutes: number;
  format: 'offline' | 'online';
  status: string;
  reason: string | null;
  cancelledBy: 'patient' | 'doctor' | null;
  proposedStartAt: string | null;
  canMove: boolean;
  canCancel: boolean;
  canReview: boolean;
  existingReview: { id: string; rating: number; text: string | null } | null;
  pendingDecisionUrl: string | null;
}

export interface PatientCabinetResponse {
  upcoming: CabinetAppointmentRow[];
  past: CabinetAppointmentRow[];
  pendingBanner: CabinetAppointmentRow | null;
  nextAppointment: CabinetAppointmentRow | null;
  miniCalendar: Array<{ date: string; count: number }>;
  favourites: CabinetDoctorSummary[];
  recentlyViewed: CabinetDoctorSummary[];
  myReviews: { leftCount: number; pendingCount: number };
  metrics: { upcomingCount: number; pastCount: number };
  zoneA: { start: string; end: string };
}

export interface DoctorListResponse {
  items: CabinetDoctorSummary[];
}

export interface CreateReviewBody {
  appointmentId: string;
  rating: number;
  text?: string;
}

export interface CreateReviewResponse {
  review: {
    id: string;
    appointmentId: string;
    doctorId: string;
    rating: number;
    text: string | null;
    createdAt: string;
  };
}

export interface PatientProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'female' | 'male' | null;
  phone: string | null;
  photoUrl: string | null;
  homeCityId: string | null;
  homeClinicId: string | null;
  language: string | null;
  theme: string | null;
}

export type PatientProfilePatch = Partial<{
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dob: string;
  gender: 'female' | 'male';
  homeCityId: string;
  homeClinicId: string;
  photoUrl: string | null;
  language: string;
  theme: string;
  photo: File;
}>;
