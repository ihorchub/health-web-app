import type {
  DoctorDashboardFreeWindow,
  DoctorDashboardMetrics,
  DoctorDashboardPendingPatient,
  DoctorDashboardVisit,
} from '@/api/doctors/dashboard.types';
import type {
  DoctorDayVisit,
  FreeWindowSlot,
  PendingPatientRow,
  WeekDaySummary,
} from '@/modules/doctor-day/types';

const STATUS_MAP: Record<DoctorDashboardVisit['status'], DoctorDayVisit['status']> = {
  Upcoming: 'upcoming',
  'Reschedule Pending': 'reschedule_pending',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Rescheduled: 'rescheduled',
};

export const mapDashboardVisit = (visit: DoctorDashboardVisit): DoctorDayVisit => {
  const patientName = `${visit.patientFirstName} ${visit.patientLastName}`.trim();

  if (visit.isProposalHold) {
    return {
      id: visit.id,
      startsAt: visit.startAt,
      durationMinutes: visit.visitDurationMinutes,
      patientName,
      status: 'reserved',
      format: visit.format,
      phone: visit.patientPhone ?? undefined,
      email: visit.patientEmail ?? undefined,
    };
  }

  const mapped: DoctorDayVisit = {
    id: visit.id,
    startsAt: visit.startAt,
    durationMinutes: visit.visitDurationMinutes,
    patientName,
    status: STATUS_MAP[visit.status],
    format: visit.format,
    reason: visit.reason ?? undefined,
    cancelledBy: visit.cancelledBy ?? undefined,
    proposedTime: visit.proposedStartAt ?? undefined,
    phone: visit.patientPhone ?? undefined,
    email: visit.patientEmail ?? undefined,
  };

  return mapped;
};

export const mapFreeWindow = (window: DoctorDashboardFreeWindow): FreeWindowSlot => ({
  id: window.id,
  start: formatClock(window.startAt),
  end: formatClock(window.endAt),
  slotsCount: window.slotsCount,
});

export const mapPendingPatient = (
  row: DoctorDashboardPendingPatient,
): PendingPatientRow => {
  const originalDay = row.originalStartAt.slice(0, 10);
  const demoDay = '2026-08-27';
  const fromClock = formatClock(row.originalStartAt);
  const toClock = formatClock(row.proposedStartAt);

  return {
    id: row.id,
    patientName: `${row.patientFirstName} ${row.patientLastName}`.trim(),
    fromTime: originalDay === demoDay ? fromClock : `Завтра ${fromClock}`,
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

/** UI-only week strip — not part of dashboard Out; derived for chrome. */
export const buildWeekStrip = (selectedYmd: string): WeekDaySummary[] => {
  const selected = new Date(`${selectedYmd}T12:00:00+03:00`);
  const mondayOffset = (selected.getDay() + 6) % 7;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() - mondayOffset);

  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const pattern: Array<Pick<WeekDaySummary, 'visits' | 'free' | 'pending' | 'cancelled'>> = [
    { visits: 1, free: 0, pending: 0, cancelled: 0 },
    { visits: 1, free: 0, pending: 1, cancelled: 0 },
    { visits: 1, free: 0, pending: 0, cancelled: 0 },
    { visits: 1, free: 0, pending: 1, cancelled: 1 },
    { visits: 1, free: 0, pending: 0, cancelled: 1 },
    { visits: 0, free: 1, pending: 0, cancelled: 0 },
    { visits: 0, free: 1, pending: 0, cancelled: 0 },
  ];

  return labels.map((weekdayShort, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const ymd = toYmd(day);
    const counts = pattern[index] ?? { visits: 0, free: 0, pending: 0, cancelled: 0 };

    return {
      ymd,
      weekdayShort,
      dayNumber: day.getDate(),
      ...counts,
      isToday: ymd === selectedYmd,
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

export const DEMO_DOCTOR_DAY = '2026-08-27';

export const PROPOSE_DATE_CHIPS = [
  { day: 25, ymd: '2026-08-25', disabled: true },
  { day: 26, ymd: '2026-08-26', disabled: true },
  { day: 27, ymd: '2026-08-27', disabled: false },
  { day: 28, ymd: '2026-08-28', disabled: false },
  { day: 29, ymd: '2026-08-29', disabled: false },
];
