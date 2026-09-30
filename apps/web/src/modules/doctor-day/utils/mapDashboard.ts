import type {
  DoctorDashboardMetrics,
  DoctorDashboardVisit,
} from '@/api/doctors/dashboard.types';
import type {
  DoctorDayVisit,
  FreeWindowSlot,
  WeekDaySummary,
} from '@/modules/doctor-day/types';

const STATUS_MAP: Record<string, DoctorDayVisit['status']> = {
  Upcoming: 'upcoming',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Rescheduled: 'rescheduled',
};

const DEFAULT_VISIT_MINUTES = 30;

export const mapDashboardVisit = (visit: DoctorDashboardVisit): DoctorDayVisit => {
  const status = STATUS_MAP[visit.status] ?? 'upcoming';

  return {
    id: visit.id,
    startsAt: visit.startAt,
    durationMinutes: DEFAULT_VISIT_MINUTES,
    patientName: visit.patientDisplayName,
    status,
    format: visit.format,
    reason: visit.reason ?? undefined,
  };
};

/** Collapse consecutive free ISO starts into windows for the free-hours list. */
export const mapFreeWindowsFromSlots = (
  freeStarts: string[],
  visitDurationMinutes = DEFAULT_VISIT_MINUTES,
): FreeWindowSlot[] => {
  if (freeStarts.length === 0) {
    return [];
  }

  const sorted = [...freeStarts].sort();
  const windows: FreeWindowSlot[] = [];
  let windowStart = sorted[0]!;
  let prev = sorted[0]!;
  let count = 1;

  const flush = (endIso: string, slotsCount: number) => {
    const endMs = Date.parse(endIso) + visitDurationMinutes * 60_000;
    windows.push({
      id: `fw_${windowStart}`,
      start: formatClock(windowStart),
      end: formatClock(new Date(endMs).toISOString()),
      slotsCount,
    });
  };

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i]!;
    const gapMs = Date.parse(current) - Date.parse(prev);
    if (gapMs === visitDurationMinutes * 60_000) {
      count += 1;
      prev = current;
      continue;
    }
    flush(prev, count);
    windowStart = current;
    prev = current;
    count = 1;
  }
  flush(prev, count);

  return windows;
};

export const mapMetrics = (metrics: DoctorDashboardMetrics) => ({
  visitsToday: metrics.visitsToday,
  freeHoursToday: metrics.freeSlotsToday,
  cancellations7d: metrics.cancellationsLast7Days,
  pastVisitsMonth: metrics.pastVisitsThisMonth,
});

const formatClock = (iso: string) =>
  new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

/** Week strip for SCR-08 sidebar — merges calendar days with API `weekStrip` counts. */
export const buildWeekStrip = (
  selectedYmd: string,
  weekStrip: Array<{
    date: string;
    visits: number;
    pending: number;
    cancelled: number;
    free: number;
  }> = [],
): WeekDaySummary[] => {
  const selected = new Date(`${selectedYmd}T12:00:00+03:00`);
  const mondayOffset = (selected.getDay() + 6) % 7;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() - mondayOffset);

  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const byDate = new Map(weekStrip.map((day) => [day.date, day]));

  return labels.map((weekdayShort, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const ymd = toYmd(day);
    const counts = byDate.get(ymd);

    return {
      ymd,
      weekdayShort,
      dayNumber: day.getDate(),
      visits: counts?.visits ?? 0,
      free: counts?.free ?? 0,
      cancelled: counts?.cancelled ?? 0,
      isToday: ymd === todayDoctorDayYmd(),
      isSelected: ymd === selectedYmd,
    };
  });
};

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Local calendar date in Europe/Kyiv for dashboard `?date=`. */
export const todayDoctorDayYmd = (now = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

export const DEMO_DOCTOR_DAY = todayDoctorDayYmd();
