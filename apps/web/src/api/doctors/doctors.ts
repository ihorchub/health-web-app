import { customInstance } from '@/api/mutator/customInstance';
import type {
  AvailabilityFilter,
  DoctorProfile,
  DoctorsSearchParams,
  DoctorsSearchResponse,
} from '@/api/doctors/types';

const pad2 = (value: number) => String(value).padStart(2, '0');

const toLocalIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** FE filter `availability` → BE `date` (SCR-02). `this_week` has no single date. */
export const availabilityToDate = (
  availability?: AvailabilityFilter,
): string | undefined => {
  if (!availability || availability === 'this_week') {
    return undefined;
  }

  const day = new Date();
  if (availability === 'tomorrow') {
    day.setDate(day.getDate() + 1);
  }

  return toLocalIsoDate(day);
};

type DoctorsSearchApiParams = Omit<DoctorsSearchParams, 'availability' | 'format'> & {
  format?: 'offline' | 'online' | 'both';
  date?: string;
};

export const getDoctorsSearch = (params: DoctorsSearchParams = {}) => {
  const { availability, format, ...rest } = params;

  const apiParams: DoctorsSearchApiParams = {
    ...rest,
    date: availabilityToDate(availability),
  };

  if (format === 'offline' || format === 'online' || format === 'both') {
    apiParams.format = format;
  }

  return customInstance<DoctorsSearchResponse>({
    url: '/v1/doctors/search',
    method: 'GET',
    params: apiParams,
  });
};

/** GET /api/v1/doctors/:doctorId */
export const getDoctorById = (doctorId: string) => {
  return customInstance<DoctorProfile>({
    url: `/v1/doctors/${encodeURIComponent(doctorId)}`,
    method: 'GET',
  });
};
