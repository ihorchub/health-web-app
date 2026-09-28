import type { DoctorScheduleResponse, WeeklyDayTemplate } from '@/api/doctors/schedule';
import type {
  SupportedFormat,
  VisitDurationMinutes,
  WorkingHoursSettings,
  ZoneAParams,
  ZoneBFormState,
} from '@/modules/working-hours/types';
import { todayDoctorDayYmd } from '@/modules/doctor-day/utils/mapDashboard';

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const FALLBACK_DAY: WeeklyDayTemplate = {
  works: true,
  start: '09:00',
  end: '18:00',
  lunchStart: '13:00',
  lunchEnd: '14:00',
};

const pickPrimaryDay = (template: DoctorScheduleResponse['weeklyTemplate']): WeeklyDayTemplate => {
  for (const key of WEEKDAYS) {
    const day = template[key];
    if (day?.works) {
      return day;
    }
  }
  return template.monday ?? FALLBACK_DAY;
};

const formatsToUi = (
  formats: Array<'offline' | 'online'>,
): SupportedFormat => {
  const hasOffline = formats.includes('offline');
  const hasOnline = formats.includes('online');
  if (hasOffline && hasOnline) {
    return 'both';
  }
  if (hasOnline) {
    return 'online';
  }
  return 'offline';
};

const uiFormatToApi = (format: SupportedFormat): Array<'offline' | 'online'> => {
  if (format === 'both') {
    return ['offline', 'online'];
  }
  return [format];
};

const asDuration = (value: number): VisitDurationMinutes => {
  if (value === 20 || value === 45) {
    return value;
  }
  return 30;
};

const dayToZoneParams = (
  day: WeeklyDayTemplate,
  schedule: DoctorScheduleResponse,
): ZoneAParams => ({
  workStart: day.start ?? '09:00',
  workEnd: day.end ?? '18:00',
  lunchStart: day.lunchStart ?? '13:00',
  lunchEnd: day.lunchEnd ?? '14:00',
  format: formatsToUi(schedule.supportedFormats),
  durationMinutes: asDuration(schedule.visitDurationMinutes),
  priceUah: schedule.basePriceUah,
});

/** Map GET schedule → UI settings used by SCR-09 panels/calendar. */
export const mapScheduleToWorkingHours = (
  schedule: DoctorScheduleResponse,
): WorkingHoursSettings => {
  const primary = pickPrimaryDay(schedule.weeklyTemplate);
  const zoneA = dayToZoneParams(primary, schedule);
  const zoneB: ZoneBFormState = {
    ...zoneA,
    vacationDayOff: false,
  };

  return {
    zoneA,
    zoneB,
    zoneAStartYmd: schedule.zoneAStart,
    zoneAEndYmd: schedule.zoneAEnd,
    zoneBStartYmd: schedule.zoneBStart,
    appointmentDays: [],
  };
};

export const zoneBFormToPatch = (zoneB: ZoneBFormState, schedule: DoctorScheduleResponse) => {
  const day: WeeklyDayTemplate = {
    works: true,
    start: zoneB.workStart,
    end: zoneB.workEnd,
    lunchStart: zoneB.lunchStart,
    lunchEnd: zoneB.lunchEnd,
  };

  const weeklyTemplate = { ...schedule.weeklyTemplate };
  for (const key of WEEKDAYS) {
    const existing = weeklyTemplate[key];
    if (existing?.works) {
      weeklyTemplate[key] = { ...day };
    }
  }

  return {
    zoneBWeeklyTemplate: weeklyTemplate,
    zoneBVisitDurationMinutes: zoneB.durationMinutes,
    supportedFormats: uiFormatToApi(zoneB.format),
    basePriceUah: zoneB.priceUah,
    vacationDates: zoneB.vacationDayOff
      ? [...new Set([...schedule.vacationDates, todayDoctorDayYmd()])]
      : schedule.vacationDates,
  };
};

export const mapUiBulkScope = (
  scope: 'today' | 'rest_of_day' | 'rest_of_week' | 'custom',
): 'whole_day' | 'rest_of_day' | 'rest_of_week' | 'custom_range' => {
  if (scope === 'today') {
    return 'whole_day';
  }
  if (scope === 'custom') {
    return 'custom_range';
  }
  return scope;
};

export const buildMonthOptions = (zoneAStart: string, zoneBEnd: string) => {
  const start = new Date(`${zoneAStart}T12:00:00+03:00`);
  const end = new Date(`${zoneBEnd}T12:00:00+03:00`);
  const options: Array<{ value: string; labelUk: string; labelEn: string }> = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= end && options.length < 4) {
    const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value,
      labelUk: new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(cursor),
      labelEn: new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(cursor),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return options;
};
