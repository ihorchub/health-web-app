const kyiv = 'Europe/Kyiv';

/** Calendar YMD (YYYY-MM-DD) in Europe/Kyiv. */
export const todayYmdKyiv = (now = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: kyiv,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

/** Noon Kyiv on today's calendar date — for day-diff comparisons. */
export const todayInKyiv = (now = new Date()): Date =>
  new Date(`${todayYmdKyiv(now)}T12:00:00+03:00`);

export const formatCabinetHeaderDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: kyiv,
  }).format(date);

export const formatTime = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: kyiv,
  }).format(new Date(iso));

const ymdInKyiv = (iso: string): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: kyiv,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));

export const formatRelativeDayLabel = (
  iso: string,
  locale: string,
  labels: { today: string; tomorrow: string },
  from: Date = todayInKyiv(),
): string => {
  const diffDays = calendarDayDiff(iso, from);

  if (diffDays === 0) {
    return labels.today;
  }

  if (diffDays === 1) {
    return labels.tomorrow;
  }

  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: kyiv,
  }).format(new Date(iso));
};

export const isSameCalendarDay = (iso: string, ymd: string): boolean =>
  ymdInKyiv(iso) === ymd;

export const toYmd = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Diff in whole calendar days from `from` to `iso` (Europe/Kyiv). */
export const calendarDayDiff = (iso: string, from: Date): number => {
  const targetYmd = ymdInKyiv(iso);
  const fromYmd =
    from instanceof Date && Number.isFinite(from.getTime())
      ? todayYmdKyiv(from)
      : todayYmdKyiv();
  const target = new Date(`${targetYmd}T12:00:00+03:00`);
  const base = new Date(`${fromYmd}T12:00:00+03:00`);
  return Math.round((target.getTime() - base.getTime()) / 86400000);
};

export const isTodayOrTomorrow = (iso: string, from: Date = todayInKyiv()): boolean => {
  const diff = calendarDayDiff(iso, from);
  return diff === 0 || diff === 1;
};
