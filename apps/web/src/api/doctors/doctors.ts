import { getDoctorMeDashboard as generatedGetDoctorMeDashboard } from '@/api/generated/doctor-schedule/doctor-schedule';
import {
  getDoctorById as generatedGetDoctorById,
  getDoctorCalendar as generatedGetDoctorCalendar,
  getDoctorsSearch as generatedGetDoctorsSearch,
} from '@/api/generated/doctors/doctors';
import type {
  DoctorCalendarParams,
  DoctorCalendarResponse,
} from '@/api/doctors/calendar.types';
import type {
  DoctorDashboardParams,
  DoctorDashboardResponse,
} from '@/api/doctors/dashboard.types';
import type {
  AvailabilityFilter,
  DoctorProfile,
  DoctorsSearchParams,
  DoctorsSearchResponse,
} from '@/api/doctors/types';
import { getZoneARange, toIsoDate } from '@/utils/dateUtils/rollingMonth';

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

  return generatedGetDoctorsSearch(apiParams) as Promise<DoctorsSearchResponse>;
};

/** GET /api/v1/doctors/:doctorId */
export const getDoctorById = (doctorId: string) => {
  return generatedGetDoctorById(doctorId) as Promise<DoctorProfile>;
};

/**
 * Month grid needs day flags — BE only fills `days` when `from`+`to` are set.
 * Default window: first day of Zone A month → last day of the next month (SCR-04 UI).
 */
const defaultCalendarRange = () => {
  const { zoneAStart, zoneAEnd } = getZoneARange();
  const from = new Date(zoneAStart.getFullYear(), zoneAStart.getMonth(), 1);
  const to = new Date(zoneAEnd.getFullYear(), zoneAEnd.getMonth() + 1, 0);
  return { from: toIsoDate(from), to: toIsoDate(to) };
};

/** GET /api/v1/doctors/:doctorId/calendar — patient auth. */
export const getDoctorCalendar = async (
  doctorId: string,
  params: DoctorCalendarParams = {},
): Promise<DoctorCalendarResponse> => {
  const range = defaultCalendarRange();
  const data = (await generatedGetDoctorCalendar(doctorId, {
    date: params.date,
    from: params.from ?? range.from,
    to: params.to ?? range.to,
    contextAppointmentId: params.contextAppointmentId,
  })) as DoctorCalendarResponse;

  // UI chips are bookable free starts only (mock previously filtered the same way).
  return {
    ...data,
    slots: data.slots.filter((slot) => slot.status === 'free'),
  };
};

/** GET /api/v1/doctors/me/dashboard */
export const getDoctorMeDashboard = (params: DoctorDashboardParams) => {
  return generatedGetDoctorMeDashboard({ date: params.date }) as Promise<
    DoctorDashboardResponse
  >;
};
