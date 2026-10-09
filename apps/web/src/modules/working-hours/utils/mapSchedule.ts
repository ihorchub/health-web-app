import type {
  DoctorScheduleResponse,
  WeeklyDayTemplate,
  WeeklyTemplate,
  ZoneBOverride,
} from '@/api/doctors/schedule';
import type {
  SupportedFormat,
  VisitDurationMinutes,
  WorkingHoursSettings,
  ZoneAParams,
  ZoneBFormState,
  ZoneBSavedInfo,
} from '@/modules/working-hours/types';
import {
  DEFAULT_WORKING_DAYS,
  WEEKDAY_KEYS,
  type WorkingDaysSelection,
} from '@/modules/working-hours/utils/calendarGrid';

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

export const workingDaysFromTemplate = (
  template: DoctorScheduleResponse['weeklyTemplate'],
): WorkingDaysSelection => {
  const next = { ...DEFAULT_WORKING_DAYS };
  for (const key of WEEKDAY_KEYS) {
    next[key] = Boolean(template[key]?.works);
  }
  return next;
};

/** Build Zone B weekly template from form hours + which days the doctor works. */
export const buildZoneBWeeklyTemplate = (
  form: ZoneBFormState,
  workingDays: WorkingDaysSelection,
): WeeklyTemplate => {
  const day = (works: boolean): WeeklyDayTemplate =>
    works
      ? {
          works: true,
          start: form.workStart,
          end: form.workEnd,
          lunchStart: form.lunchStart,
          lunchEnd: form.lunchEnd,
        }
      : { works: false };

  return {
    monday: day(workingDays.monday),
    tuesday: day(workingDays.tuesday),
    wednesday: day(workingDays.wednesday),
    thursday: day(workingDays.thursday),
    friday: day(workingDays.friday),
    saturday: day(workingDays.saturday),
    sunday: day(workingDays.sunday),
  };
};

/** Base Zone B constructor save (no range override required). */
export const zoneBFormToBasePatch = (
  form: ZoneBFormState,
  workingDays: WorkingDaysSelection,
  zoneBStartYmd: string,
) => {
  const duration =
    form.customDuration === 20 || form.customDuration === 30 || form.customDuration === 45
      ? form.customDuration
      : form.durationMinutes;

  return {
    zoneBWeeklyTemplate: buildZoneBWeeklyTemplate(form, workingDays),
    zoneBVisitDurationMinutes: duration,
    supportedFormats: uiFormatToApi(form.format),
    basePriceUah: form.priceUah,
    basePriceEffectiveFrom: zoneBStartYmd,
  };
};

const addDaysYmd = (ymd: string, days: number) => {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y!, m! - 1, d! + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

export const listYmdsInInclusiveRange = (from: string, to: string): string[] => {
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDaysYmd(cursor, 1);
  }
  return days;
};

/** All Zone B calendar days covered by any range override. */
export const buildPlannedOverrideDays = (overrides: ZoneBOverride[]): Set<string> => {
  const set = new Set<string>();
  for (const override of overrides) {
    for (const ymd of listYmdsInInclusiveRange(override.from, override.to)) {
      set.add(ymd);
    }
  }
  return set;
};

export const findOverrideForDay = (
  overrides: ZoneBOverride[],
  ymd: string,
): ZoneBOverride | null =>
  overrides.find((override) => ymd >= override.from && ymd <= override.to) ?? null;

/** Override that fully covers every selected day, or null if none / mixed. */
export const findOverrideForSelection = (
  overrides: ZoneBOverride[],
  selectedDays: string[],
): ZoneBOverride | null => {
  if (selectedDays.length === 0) {
    return null;
  }
  const first = findOverrideForDay(overrides, selectedDays[0]!);
  if (!first) {
    return null;
  }
  if (selectedDays.every((ymd) => ymd >= first.from && ymd <= first.to)) {
    return first;
  }
  return null;
};

export const overrideToSavedInfo = (
  override: ZoneBOverride,
  defaults: ZoneAParams,
): ZoneBSavedInfo => ({
  workStart: override.workStart ?? defaults.workStart,
  workEnd: override.workEnd ?? defaults.workEnd,
  lunchStart: override.lunchStart ?? defaults.lunchStart,
  lunchEnd: override.lunchEnd ?? defaults.lunchEnd,
  format: override.supportedFormats
    ? formatsToUi(override.supportedFormats)
    : defaults.format,
  durationMinutes: override.visitDurationMinutes
    ? asDuration(override.visitDurationMinutes)
    : defaults.durationMinutes,
  priceUah: override.basePriceUah ?? defaults.priceUah,
});

export const overrideToFormPatch = (
  override: ZoneBOverride,
  defaults: ZoneBFormState,
): Partial<ZoneBFormState> => ({
  ...overrideToSavedInfo(override, defaults),
  vacationDayOff: override.dayOff === true,
  customDuration: undefined,
});

/** Map GET schedule → UI settings used by SCR-09 panels/calendar. */
export const mapScheduleToWorkingHours = (
  schedule: DoctorScheduleResponse,
): WorkingHoursSettings => {
  const primary = pickPrimaryDay(schedule.weeklyTemplate);
  /** Zone A stays on the frozen global template / price / duration / format. */
  const zoneA = dayToZoneParams(primary, schedule);
  /**
   * Zone B form prefers an override that covers the first Zone B day so saved
   * plans do not rewrite Zone A display (shared globals stay frozen).
   */
  const zoneBCover = findOverrideForDay(schedule.zoneBOverrides ?? [], schedule.zoneBStart);
  const promo = {
    promoPriceUah: schedule.promoPriceUah,
    promoValidUntil: schedule.promoValidUntil,
  };
  const zoneB: ZoneBFormState = zoneBCover
    ? {
        ...overrideToSavedInfo(zoneBCover, zoneA),
        vacationDayOff: zoneBCover.dayOff === true,
        ...promo,
      }
    : {
        ...zoneA,
        vacationDayOff: false,
        ...promo,
      };

  return {
    zoneA,
    zoneB,
    zoneAStartYmd: schedule.zoneAStart,
    zoneAEndYmd: schedule.zoneAEnd,
    zoneBStartYmd: schedule.zoneBStart,
    appointmentDays: [],
    vacationDates: schedule.vacationDates ?? [],
  };
};

/** Build PATCH body that applies Zone B form values only to the selected inclusive range. */
export const zoneBFormToRangePatch = (
  zoneB: ZoneBFormState,
  range: { from: string; to: string },
) => {
  const duration =
    zoneB.customDuration === 20 ||
    zoneB.customDuration === 30 ||
    zoneB.customDuration === 45
      ? zoneB.customDuration
      : zoneB.durationMinutes;

  return {
    zoneBOverride: {
      from: range.from,
      to: range.to,
      supportedFormats: uiFormatToApi(zoneB.format),
      visitDurationMinutes: duration,
      workStart: zoneB.workStart,
      workEnd: zoneB.workEnd,
      lunchStart: zoneB.lunchStart,
      lunchEnd: zoneB.lunchEnd,
      basePriceUah: zoneB.priceUah,
      // Only set dayOff when marking vacation; omit false so plain saves do not clear vacation.
      ...(zoneB.vacationDayOff ? { dayOff: true as const } : {}),
    },
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
