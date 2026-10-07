import {
  daysInMonth,
  mondayBasedWeekday,
  parseIsoDate,
  toIsoDate,
} from '@/utils/dateUtils/rollingMonth';

export interface CalendarDayCell {
  ymd: string;
  dayNumber: number;
  inMonth: boolean;
}

export interface CalendarMonthBlock {
  year: number;
  monthIndex: number;
  cells: CalendarDayCell[];
}

const padMonth = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

const buildMonthBlock = (year: number, monthIndex: number): CalendarMonthBlock => {
  const totalDays = daysInMonth(year, monthIndex);
  const firstWeekday = mondayBasedWeekday(new Date(year, monthIndex, 1));
  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ ymd: '', dayNumber: 0, inMonth: false });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const d = new Date(year, monthIndex, day);
    cells.push({ ymd: toIsoDate(d), dayNumber: day, inMonth: true });
  }

  return { year, monthIndex, cells };
};

/** Single calendar month for compact date pickers. */
export const buildSingleMonthBlock = (anchorYm: string): CalendarMonthBlock => {
  const [y, m] = anchorYm.split('-').map(Number);
  return buildMonthBlock(y!, (m ?? 1) - 1);
};

/** Three consecutive calendar months starting at the given YYYY-MM anchor. */
export const buildThreeMonthBlocks = (anchorYm: string): CalendarMonthBlock[] => {
  const [y, m] = anchorYm.split('-').map(Number);
  const start = new Date(y, m - 1, 1);

  return [0, 1, 2].map((offset) => {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    return buildMonthBlock(monthDate.getFullYear(), monthDate.getMonth());
  });
};

export const shiftYm = (ym: string, deltaMonths: number): string => {
  const [y, m] = ym.split('-').map(Number);
  const date = new Date(y!, (m ?? 1) - 1 + deltaMonths, 1);
  return padMonth(date.getFullYear(), date.getMonth());
};

export const ymdToYm = (ymd: string): string => ymd.slice(0, 7);

export const zoneForDate = (
  ymd: string,
  zoneAStartYmd: string,
  zoneAEndYmd: string,
  zoneBStartYmd: string,
): 'a' | 'b' | 'none' => {
  if (!ymd) {
    return 'none';
  }
  const d = parseIsoDate(ymd);
  const aStart = parseIsoDate(zoneAStartYmd);
  const aEnd = parseIsoDate(zoneAEndYmd);
  const bStart = parseIsoDate(zoneBStartYmd);

  if (d >= aStart && d <= aEnd) {
    return 'a';
  }
  if (d >= bStart) {
    return 'b';
  }
  return 'none';
};

export const isWeekendYmd = (ymd: string): boolean => {
  const d = parseIsoDate(ymd);
  const day = d.getDay();
  return day === 0 || day === 6;
};

/** 0 = Sunday … 6 = Saturday (JS Date.getDay()). */
export const weekdayOfYmd = (ymd: string): number => parseIsoDate(ymd).getDay();

/** Which weekdays to mass-mark as day off (JS getDay: 0 Sun … 6 Sat). */
export type WeekdayOffSelection = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export const DEFAULT_WEEKEND_OFF: WeekdayOffSelection = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: true,
  sunday: true,
};

/** Active = doctor works that weekday (Zone B regular schedule). */
export type WorkingDaysSelection = WeekdayOffSelection;

export const DEFAULT_WORKING_DAYS: WorkingDaysSelection = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

export const WEEKDAY_KEYS: Array<keyof WorkingDaysSelection> = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WEEKDAY_FLAG_TO_JS: Array<{ key: keyof WeekdayOffSelection; jsDay: number }> = [
  { key: 'sunday', jsDay: 0 },
  { key: 'monday', jsDay: 1 },
  { key: 'tuesday', jsDay: 2 },
  { key: 'wednesday', jsDay: 3 },
  { key: 'thursday', jsDay: 4 },
  { key: 'friday', jsDay: 5 },
  { key: 'saturday', jsDay: 6 },
];

export const jsDayToWeekdayKey = (jsDay: number): keyof WorkingDaysSelection => {
  const found = WEEKDAY_FLAG_TO_JS.find((row) => row.jsDay === jsDay);
  return found?.key ?? 'monday';
};

export const hasAnyWeekdayOff = (days: WeekdayOffSelection): boolean =>
  WEEKDAY_FLAG_TO_JS.some(({ key }) => days[key]);

/** Inclusive YYYY-MM-DD dates matching selected weekdays in the range. */
export const listWeekdayOffYmdsInRange = (
  fromYmd: string,
  toYmd: string,
  days: WeekdayOffSelection,
): string[] => {
  const activeJsDays = new Set(
    WEEKDAY_FLAG_TO_JS.filter(({ key }) => days[key]).map(({ jsDay }) => jsDay),
  );
  if (activeJsDays.size === 0) {
    return [];
  }
  const start = fromYmd <= toYmd ? fromYmd : toYmd;
  const end = fromYmd <= toYmd ? toYmd : fromYmd;
  const result: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    if (activeJsDays.has(weekdayOfYmd(cursor))) {
      result.push(cursor);
    }
    const d = parseIsoDate(cursor);
    d.setDate(d.getDate() + 1);
    cursor = toIsoDate(d);
  }
  return result;
};

/** @deprecated use listWeekdayOffYmdsInRange */
export type WeekendDaysSelection = Pick<WeekdayOffSelection, 'saturday' | 'sunday'>;

export const listWeekendYmdsInRange = (
  fromYmd: string,
  toYmd: string,
  days: WeekendDaysSelection,
): string[] =>
  listWeekdayOffYmdsInRange(fromYmd, toYmd, {
    ...DEFAULT_WEEKEND_OFF,
    saturday: days.saturday,
    sunday: days.sunday,
  });

export const formatDisplayDate = (ymd: string, locale: string): string => {
  const d = parseIsoDate(ymd);
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

export const monthTitle = (year: number, monthIndex: number, locale: string): string => {
  const d = new Date(year, monthIndex, 1);
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export { padMonth };
