import {
  findMockDoctor,
  MOCK_DOCTOR_RECORDS,
  toDoctorProfile,
  toSearchCard,
} from '@/api/mocks/doctorsFixtures';
import { DoctorNotFoundError } from '@/api/doctors/errors';
import type {
  DoctorSearchCard,
  DoctorsSearchParams,
  DoctorsSearchResponse,
} from '@/api/doctors/types';

const SPECIALTY_ALIASES: Record<string, string[]> = {
  family_doctor: ['сімейний', 'family', 'family doctor', 'терапевт'],
  cardiologist: ['кардіолог', 'cardiologist', 'cardio'],
  dermatologist: ['дерматолог', 'dermatologist', 'derma'],
  paediatrician: ['педіатр', 'paediatrician', 'pediatric', 'гінеколог', 'невролог'],
};

const effectivePrice = (doctor: DoctorSearchCard) =>
  doctor.promoPrice ?? doctor.basePrice;

const matchesFormat = (
  doctor: DoctorSearchCard,
  format?: DoctorsSearchParams['format'],
) => {
  if (!format) {
    return true;
  }
  if (format === 'both') {
    return doctor.supportedFormats === 'both';
  }
  return doctor.supportedFormats === format || doctor.supportedFormats === 'both';
};

const matchesQuery = (doctor: DoctorSearchCard, q?: string) => {
  if (!q?.trim()) {
    return true;
  }
  const needle = q.trim().toLowerCase();
  const haystack = [
    doctor.firstName,
    doctor.lastName,
    `${doctor.firstName} ${doctor.lastName}`,
    doctor.specialty,
    doctor.clinicId,
    doctor.cityId,
    ...(SPECIALTY_ALIASES[doctor.specialty] ?? []),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
};

const sortDoctors = (
  items: DoctorSearchCard[],
  sort: DoctorsSearchParams['sort'],
  homeClinicId?: string | null,
) => {
  return [...items].sort((a, b) => {
    if (homeClinicId) {
      const aHome = a.clinicId === homeClinicId ? 0 : 1;
      const bHome = b.clinicId === homeClinicId ? 0 : 1;
      if (aHome !== bHome) {
        return aHome - bHome;
      }
    }

    if (sort === 'nearest_slot') {
      if (!a.nearestFreeAt && !b.nearestFreeAt) {
        return 0;
      }
      if (!a.nearestFreeAt) {
        return 1;
      }
      if (!b.nearestFreeAt) {
        return -1;
      }
      return a.nearestFreeAt.localeCompare(b.nearestFreeAt);
    }

    if (b.ratingAverage !== a.ratingAverage) {
      return b.ratingAverage - a.ratingAverage;
    }
    if (!a.nearestFreeAt) {
      return 1;
    }
    if (!b.nearestFreeAt) {
      return -1;
    }
    return a.nearestFreeAt.localeCompare(b.nearestFreeAt);
  });
};

export const mockSearchDoctors = async (
  params: DoctorsSearchParams = {},
  options?: { homeClinicId?: string | null; isPatient?: boolean },
): Promise<DoctorsSearchResponse> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 280);
  });

  const limit = params.limit ?? 6;
  const offset = params.cursor ? Number(params.cursor) || 0 : 0;

  let items = MOCK_DOCTOR_RECORDS.map(toSearchCard).filter((doctor) => {
    if (params.cityId && doctor.cityId !== params.cityId) {
      return false;
    }
    if (params.clinicId && doctor.clinicId !== params.clinicId) {
      return false;
    }
    if (params.specialty && doctor.specialty !== params.specialty) {
      return false;
    }
    if (!matchesFormat(doctor, params.format)) {
      return false;
    }
    if (params.minRating !== undefined && doctor.ratingAverage < params.minRating) {
      return false;
    }
    const price = effectivePrice(doctor);
    if (params.priceMin !== undefined && price < params.priceMin) {
      return false;
    }
    if (params.priceMax !== undefined && price > params.priceMax) {
      return false;
    }
    if (!matchesQuery(doctor, params.q)) {
      return false;
    }
    if (
      params.availability === 'today' &&
      !doctor.nearestFreeAt?.includes('2026-09-15')
    ) {
      return false;
    }
    if (
      params.availability === 'tomorrow' &&
      !doctor.nearestFreeAt?.includes('2026-09-16')
    ) {
      return false;
    }
    if (params.availability === 'this_week' && !doctor.nearestFreeAt) {
      return false;
    }
    return true;
  });

  items = sortDoctors(items, params.sort ?? 'rating', options?.homeClinicId);

  const page = items.slice(offset, offset + limit).map((doctor) => ({
    ...doctor,
    isFavourite: options?.isPatient ? doctor.isFavourite : false,
  }));

  const nextOffset = offset + limit;
  return {
    total: items.length,
    nextCursor: nextOffset < items.length ? String(nextOffset) : null,
    items: page,
    prefill: options?.isPatient
      ? { cityId: 'city_kyiv', clinicId: 'clinic_kyiv_center' }
      : undefined,
  };
};

export const mockGetDoctorById = async (
  doctorId: string,
  options?: { isPatient?: boolean },
) => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });

  const record = findMockDoctor(doctorId);
  if (!record) {
    throw new DoctorNotFoundError();
  }

  const profile = toDoctorProfile(record);
  return {
    ...profile,
    isFavourite: options?.isPatient ? profile.isFavourite : false,
  };
};
