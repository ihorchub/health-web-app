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

/** Three consecutive calendar months starting at the given YYYY-MM anchor. */
export const buildThreeMonthBlocks = (anchorYm: string): CalendarMonthBlock[] => {
  const [y, m] = anchorYm.split('-').map(Number);
  const start = new Date(y, m - 1, 1);

  return [0, 1, 2].map((offset) => {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const totalDays = daysInMonth(year, monthIndex);
    const firstWeekday = mondayBasedWeekday(monthDate);
    const cells: CalendarDayCell[] = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ ymd: '', dayNumber: 0, inMonth: false });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const d = new Date(year, monthIndex, day);
      cells.push({ ymd: toIsoDate(d), dayNumber: day, inMonth: true });
    }

    return { year, monthIndex, cells };
  });
};

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
