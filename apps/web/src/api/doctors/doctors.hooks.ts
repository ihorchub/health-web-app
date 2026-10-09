import { useQuery } from '@tanstack/react-query';

import {
  getDoctorById,
  getDoctorCalendar,
  getDoctorMeDashboard,
  getDoctorsSearch,
} from '@/api/doctors/doctors';
import type {
  DoctorDashboardParams,
  DoctorDashboardResponse,
} from '@/api/doctors/dashboard.types';
import type {
  DoctorCalendarParams,
  DoctorCalendarResponse,
  DoctorProfile,
  DoctorsSearchParams,
  DoctorsSearchResponse,
} from '@/api/doctors/types';

export const doctorsQueryKeys = {
  search: (params: DoctorsSearchParams, roleKey: string) =>
    ['doctors', 'search', roleKey, params] as const,
  byId: (doctorId: string, roleKey: string) => ['doctors', doctorId, roleKey] as const,
  calendar: (doctorId: string, params: DoctorCalendarParams) =>
    ['doctors', doctorId, 'calendar', params] as const,
  meDashboard: (params: DoctorDashboardParams) =>
    ['doctors', 'me', 'dashboard', params] as const,
};

interface UseGetDoctorsSearchOptions {
  /** Distinguishes guest vs patient cache (session cookie enriches favourites/prefill). */
  isPatient?: boolean;
  enabled?: boolean;
}

/** GET /api/v1/doctors/search */
export const useGetDoctorsSearch = (
  params: DoctorsSearchParams,
  options: UseGetDoctorsSearchOptions = {},
) => {
  const roleKey = options.isPatient ? 'patient' : 'guest';

  return useQuery<DoctorsSearchResponse>({
    queryKey: doctorsQueryKeys.search(params, roleKey),
    queryFn: () => getDoctorsSearch(params),
    enabled: options.enabled ?? true,
    placeholderData: (previous) => previous,
  });
};

interface UseGetDoctorByIdOptions {
  isPatient?: boolean;
  enabled?: boolean;
}

/** GET /api/v1/doctors/:doctorId */
export const useGetDoctorById = (
  doctorId: string | undefined,
  options: UseGetDoctorByIdOptions = {},
) => {
  const roleKey = options.isPatient ? 'patient' : 'guest';

  return useQuery<DoctorProfile>({
    queryKey: doctorsQueryKeys.byId(doctorId ?? '', roleKey),
    queryFn: () => getDoctorById(doctorId!),
    enabled: Boolean(doctorId) && (options.enabled ?? true),
  });
};

interface UseGetDoctorCalendarOptions {
  enabled?: boolean;
  /** Frontend-spec: refetch while SCR-04 wizard is open. */
  refetchIntervalMs?: number | false;
}

/** GET /api/v1/doctors/:doctorId/calendar */
export const useGetDoctorCalendar = (
  doctorId: string | undefined,
  params: DoctorCalendarParams,
  options: UseGetDoctorCalendarOptions = {},
) => {
  return useQuery<DoctorCalendarResponse>({
    queryKey: doctorsQueryKeys.calendar(doctorId ?? '', params),
    queryFn: () => getDoctorCalendar(doctorId!, params),
    enabled: Boolean(doctorId) && (options.enabled ?? true),
    refetchInterval: options.refetchIntervalMs ?? false,
    refetchOnWindowFocus: true,
    placeholderData: (previous) => previous,
  });
};

interface UseGetDoctorMeDashboardOptions {
  enabled?: boolean;
}

/** GET /api/v1/doctors/me/dashboard */
export const useGetDoctorMeDashboard = (
  params: DoctorDashboardParams,
  options: UseGetDoctorMeDashboardOptions = {},
) => {
  return useQuery<DoctorDashboardResponse>({
    queryKey: doctorsQueryKeys.meDashboard(params),
    queryFn: () => getDoctorMeDashboard(params),
    enabled: Boolean(params.date) && (options.enabled ?? true),
  });
};

export type {
  DoctorsSearchParams,
  DoctorsSearchResponse,
  DoctorSearchCard,
  DoctorProfile,
  DoctorReview,
  DoctorCalendarParams,
  DoctorCalendarResponse,
  CalendarSlot,
  CalendarDaySummary,
  DayAvailabilityFlag,
} from '@/api/doctors/types';

export type {
  DoctorDashboardParams,
  DoctorDashboardResponse,
  DoctorDashboardVisit,
  DoctorDashboardMetrics,
} from '@/api/doctors/dashboard.types';
