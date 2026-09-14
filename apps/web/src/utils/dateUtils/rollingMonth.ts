/** R-13 rolling bookable window helpers (local calendar dates, no TZ libs). */

const pad2 = (n: number) => String(n).padStart(2, '0');

export const toIsoDate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const parseIsoDate = (iso: string): Date => {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day);
};

export const startOfLocalDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Today … one calendar month later minus one day (inclusive). */
export const getZoneARange = (today: Date = new Date()) => {
  const zoneAStart = startOfLocalDay(today);
  const zoneAEnd = new Date(zoneAStart);
  zoneAEnd.setMonth(zoneAEnd.getMonth() + 1);
  zoneAEnd.setDate(zoneAEnd.getDate() - 1);
  return { zoneAStart, zoneAEnd };
};

export const isDateInRange = (iso: string, start: Date, end: Date): boolean => {
  const d = parseIsoDate(iso);
  return d >= startOfLocalDay(start) && d <= startOfLocalDay(end);
};

export const addMonths = (d: Date, months: number): Date => {
  const next = new Date(d.getFullYear(), d.getMonth(), 1);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const daysInMonth = (year: number, monthIndex: number): number =>
  new Date(year, monthIndex + 1, 0).getDate();

/** Monday = 0 … Sunday = 6 */
export const mondayBasedWeekday = (d: Date): number => (d.getDay() + 6) % 7;
