import type {
  DoctorDashboardMetrics,
  DoctorDashboardVisit,
} from '@/api/doctors/dashboard.types';
import type {
  DoctorDayVisit,
  FreeWindowSlot,
  PendingPatientRow,
  WeekDaySummary,
} from '@/modules/doctor-day/types';

const STATUS_MAP: Record<string, DoctorDayVisit['status']> = {
  Upcoming: 'upcoming',
  'Reschedule Pending': 'reschedule_pending',
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
    proposedTime: visit.proposedStartAt ?? undefined,
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

export const mapPendingPatient = (row: DoctorDashboardVisit): PendingPatientRow => {
  const fromClock = formatClock(row.startAt);
  const toClock = row.proposedStartAt ? formatClock(row.proposedStartAt) : '—';

  return {
    id: row.id,
    patientName: row.patientDisplayName,
    fromTime: fromClock,
    toTime: toClock,
  };
};

export const mapMetrics = (metrics: DoctorDashboardMetrics) => ({
  visitsToday: metrics.visitsToday,
  pendingDecisions: metrics.pendingCount,
  freeHoursToday: metrics.freeSlotsToday,
  cancellations7d: metrics.cancellationsLast7Days,
});

export const mapProposeSlotLabels = (isoSlots: string[]): string[] =>
  isoSlots.map((slot) => formatClock(slot));

const formatClock = (iso: string) =>
  new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

/** UI-only week strip — derived around the selected day (no per-day API yet). */
export const buildWeekStrip = (selectedYmd: string): WeekDaySummary[] => {
  const selected = new Date(`${selectedYmd}T12:00:00+03:00`);
  const mondayOffset = (selected.getDay() + 6) % 7;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() - mondayOffset);

  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  return labels.map((weekdayShort, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const ymd = toYmd(day);

    return {
      ymd,
      weekdayShort,
      dayNumber: day.getDate(),
      visits: 0,
      free: 0,
      pending: 0,
      cancelled: 0,
      isToday: ymd === toYmd(new Date()),
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

export const PROPOSE_DATE_CHIPS = (() => {
  const today = todayDoctorDayYmd();
  const base = new Date(`${today}T12:00:00+03:00`);
  return [-2, -1, 0, 1, 2].map((offset) => {
    const day = new Date(base);
    day.setDate(base.getDate() + offset);
    const ymd = toYmd(day);
    return {
      day: day.getDate(),
      ymd,
      disabled: offset < 0,
    };
  });
})();
