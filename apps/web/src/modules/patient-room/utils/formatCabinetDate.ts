const kyiv = 'Europe/Kyiv';

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

export const formatRelativeDayLabel = (
  iso: string,
  locale: string,
  labels: { today: string; tomorrow: string },
): string => {
  const target = new Date(iso);
  const now = new Date('2026-08-27T12:00:00+03:00');
  const startOf = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startOf(target) - startOf(now)) / 86400000);

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
  }).format(target);
};

export const isSameCalendarDay = (iso: string, ymd: string): boolean =>
  iso.startsWith(ymd);

export const toYmd = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Diff in whole calendar days from `from` to `iso` (Kyiv demo clock). */
export const calendarDayDiff = (iso: string, from: Date): number => {
  const target = new Date(iso);
  const startOf = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.round((startOf(target) - startOf(from)) / 86400000);
};

export const isTodayOrTomorrow = (iso: string, from: Date): boolean => {
  const diff = calendarDayDiff(iso, from);
  return diff === 0 || diff === 1;
};
