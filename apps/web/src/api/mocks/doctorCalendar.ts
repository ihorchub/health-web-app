import { DoctorNotFoundError } from '@/api/doctors/errors';
import type {
  CalendarDaySummary,
  CalendarSlot,
  DayAvailabilityFlag,
  DoctorCalendarParams,
  DoctorCalendarResponse,
} from '@/api/doctors/calendar.types';
import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  getZoneARange,
  isDateInRange,
  parseIsoDate,
  toIsoDate,
} from '@/utils/dateUtils/rollingMonth';

const VISIT_DURATION_BY_DOCTOR: Record<string, number> = {
  doc_olena_kovalenko: 30,
  doc_andriy_shevchenko: 30,
  doc_maria_bondar: 20,
  doc_igor_melnyk: 45,
  doc_sergiy_holub: 30,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const supportedFormatList = (
  formats: 'offline' | 'online' | 'both',
): Array<'offline' | 'online'> => {
  if (formats === 'both') {
    return ['offline', 'online'];
  }
  return [formats];
};

const provisionalFlag = (
  iso: string,
  zoneAStart: Date,
  zoneAEnd: Date,
): DayAvailabilityFlag => {
  const day = parseIsoDate(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (day < today) {
    return 'past';
  }
  if (!isDateInRange(iso, zoneAStart, zoneAEnd)) {
    return 'outside_window';
  }

  const weekday = day.getDay();
  const seed = hashString(iso);

  if (weekday === 0 || (weekday === 6 && seed % 11 === 0)) {
    return 'day_off';
  }

  if (seed % 17 === 0) {
    return 'full';
  }

  return 'has_free';
};

const slotTimesForDay = (iso: string, durationMinutes: number): string[] => {
  const seed = hashString(iso);
  const morning = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoon = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const pool =
    durationMinutes >= 45
      ? [...morning.slice(0, 4), ...afternoon.slice(0, 4)]
      : [...morning, ...afternoon];

  return pool.filter((_, index) => (seed + index) % 5 !== 0);
};

const buildSlotsForDate = (
  iso: string,
  durationMinutes: number,
  flag: DayAvailabilityFlag,
): CalendarSlot[] => {
  if (flag === 'past' || flag === 'outside_window' || flag === 'day_off') {
    return [];
  }

  const times = slotTimesForDay(iso, durationMinutes);
  const now = Date.now();

  return times.map((time, index) => {
    const startAt = `${iso}T${time}:00+03:00`;
    const startMs = Date.parse(startAt);

    if (Number.isFinite(startMs) && startMs < now) {
      return { startAt, status: 'past' as const };
    }

    if (flag === 'full') {
      return { startAt, status: 'taken' as const };
    }

    const seed = hashString(`${iso}:${time}`);
    if (seed % 7 === 0) {
      return { startAt, status: 'taken' as const };
    }
    if (seed % 11 === 0) {
      return { startAt, status: 'reserved' as const };
    }

    if (index < 2 || seed % 3 !== 0) {
      return { startAt, status: 'free' as const };
    }

    return { startAt, status: 'taken' as const };
  });
};

const freeSlotsFor = (
  iso: string,
  durationMinutes: number,
  flag: DayAvailabilityFlag,
) =>
  buildSlotsForDate(iso, durationMinutes, flag).filter((slot) => slot.status === 'free');

const resolveDayFlag = (
  iso: string,
  zoneAStart: Date,
  zoneAEnd: Date,
  durationMinutes: number,
): DayAvailabilityFlag => {
  const flag = provisionalFlag(iso, zoneAStart, zoneAEnd);
  if (flag !== 'has_free') {
    return flag;
  }
  return freeSlotsFor(iso, durationMinutes, flag).length > 0 ? 'has_free' : 'full';
};

const enumerateDays = (from: Date, to: Date): string[] => {
  const dates: string[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (cursor <= end) {
    dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};

const defaultWindow = (zoneAStart: Date, zoneAEnd: Date) => {
  const from = new Date(zoneAStart.getFullYear(), zoneAStart.getMonth(), 1);
  const toMonth = new Date(zoneAEnd.getFullYear(), zoneAEnd.getMonth() + 1, 0);
  return { from, to: toMonth };
};

/** Mock GET /api/v1/doctors/:doctorId/calendar */
export const mockGetDoctorCalendar = async (
  doctorId: string,
  params: DoctorCalendarParams = {},
): Promise<DoctorCalendarResponse> => {
  await delay(220);

  const doctor = findMockDoctor(doctorId);
  if (!doctor) {
    throw new DoctorNotFoundError();
  }

  const { zoneAStart, zoneAEnd } = getZoneARange();
  const visitDurationMinutes = VISIT_DURATION_BY_DOCTOR[doctorId] ?? 30;

  const window = defaultWindow(zoneAStart, zoneAEnd);
  const from = params.from ? parseIsoDate(params.from) : window.from;
  const to = params.to ? parseIsoDate(params.to) : window.to;

  const days: CalendarDaySummary[] = enumerateDays(from, to).map((date) => ({
    date,
    flag: resolveDayFlag(date, zoneAStart, zoneAEnd, visitDurationMinutes),
  }));

  const firstFree = days.find((day) => day.flag === 'has_free')?.date ?? toIsoDate(zoneAStart);

  const selectedDate =
    params.date && days.some((day) => day.date === params.date && day.flag === 'has_free')
      ? params.date
      : firstFree;

  const selectedFlag =
    days.find((day) => day.date === selectedDate)?.flag ??
    resolveDayFlag(selectedDate, zoneAStart, zoneAEnd, visitDurationMinutes);

  const slots = freeSlotsFor(selectedDate, visitDurationMinutes, selectedFlag);

  return {
    doctorId,
    zoneAStart: toIsoDate(zoneAStart),
    zoneAEnd: toIsoDate(zoneAEnd),
    visitDurationMinutes,
    supportedFormats: supportedFormatList(doctor.supportedFormats),
    days,
    slots,
  };
};

/** Expose duration for book mock without re-query. */
export const mockVisitDurationMinutes = (doctorId: string): number =>
  VISIT_DURATION_BY_DOCTOR[doctorId] ?? 30;
