export type VisitFormat = 'offline' | 'online' | 'both';

export type SearchSort = 'rating' | 'nearest_slot';

export type AvailabilityFilter = 'today' | 'tomorrow' | 'this_week';

export type SpecialtyId =
  | 'family_doctor'
  | 'cardiologist'
  | 'dermatologist'
  | 'paediatrician'
  | 'neurologist'
  | 'ophthalmologist'
  | 'orthopedist'
  | 'endocrinologist'
  | 'gastroenterologist'
  | 'gynecologist'
  | 'urologist'
  | 'otolaryngologist'
  | 'psychiatrist'
  | 'pulmonologist';

export interface DoctorsSearchParams {
  q?: string;
  cityId?: string;
  clinicId?: string;
  specialty?: string;
  format?: 'offline' | 'online' | 'both';
  availability?: AvailabilityFilter;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: SearchSort;
  cursor?: string;
  limit?: number;
}

/** Search card DTO — matches GET /api/v1/doctors/search item. */
export interface DoctorSearchCard {
  id: string;
  firstName: string;
  lastName: string;
  specialty: SpecialtyId;
  clinicId: string;
  cityId: string;
  clinicName?: string;
  cityName?: string;
  photoUrl: string | null;
  supportedFormats: VisitFormat;
  nearestFreeAt: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  isFavourite: boolean;
  /** Present on mock/profile payloads; search API may omit until bio ships. */
  descriptionUk?: string;
  descriptionEn?: string;
}

export interface DoctorsSearchResponse {
  total: number;
  nextCursor: string | null;
  items: DoctorSearchCard[];
  prefill?: {
    cityId: string | null;
    clinicId: string | null;
  };
}

export interface DoctorReview {
  id: string;
  rating: number;
  text: string;
  patientDisplayName: string;
  createdAt: string;
}

/** Full public profile — GET /api/v1/doctors/:doctorId */
export interface DoctorProfile {
  id: string;
  firstName: string;
  lastName: string;
  specialty: SpecialtyId;
  clinicId: string;
  cityId: string;
  clinicName?: string;
  cityName?: string;
  address: string;
  photoUrl: string | null;
  yearsPractice: number;
  visitDurationMinutes?: number;
  languages: Array<'uk' | 'en'>;
  descriptionUk: string;
  descriptionEn: string;
  bio?: string;
  supportedFormats: VisitFormat;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  consultationCount: number;
  isFavourite: boolean;
  reviews: DoctorReview[];
}

export type {
  CalendarDaySummary,
  CalendarSlot,
  DayAvailabilityFlag,
  DoctorCalendarParams,
  DoctorCalendarResponse,
  SlotStatus,
} from '@/api/doctors/calendar.types';
