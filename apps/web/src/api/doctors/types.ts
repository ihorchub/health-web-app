export type VisitFormat = 'offline' | 'online' | 'both';

export type SearchSort = 'rating' | 'nearest_slot';

export type AvailabilityFilter = 'today' | 'tomorrow' | 'this_week';

export type SpecialtyId =
  'family_doctor' | 'cardiologist' | 'dermatologist' | 'paediatrician';

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

/** Search card DTO — ids for catalogs; denormalized names only if BE sends locale snapshot. */
export interface DoctorSearchCard {
  id: string;
  firstName: string;
  lastName: string;
  specialty: SpecialtyId;
  clinicId: string;
  cityId: string;
  photoUrl: string;
  supportedFormats: VisitFormat;
  nearestFreeAt: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  isFavourite: boolean;
  descriptionUk: string;
  descriptionEn: string;
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
  address: string;
  photoUrl: string;
  yearsPractice: number;
  languages: Array<'uk' | 'en'>;
  descriptionUk: string;
  descriptionEn: string;
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
