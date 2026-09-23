/**
 * R-13 rolling bookable month ("Zone A") — backend-spec.md "Slots and double booking".
 *
 * zoneAStart = start of today (Kyiv local)
 * zoneAEnd   = same calendar day one month later, minus one day (inclusive)
 * Example: today 10 Aug -> bookable through 9 Sep inclusive.
 */

import { getZonedDateParts, KYIV_TZ, zonedTimeToUtc } from "./timezone.js";

export type CalendarDate = { year: number; month: number; day: number };

export type ZoneABounds = {
  zoneAStartDate: CalendarDate;
  zoneAEndDate: CalendarDate;
  /** Inclusive lower bound instant (Kyiv midnight of zoneAStartDate). */
  zoneAStartUtc: Date;
  /** Exclusive upper bound instant (Kyiv midnight of the day AFTER zoneAEndDate). */
  zoneAEndExclusiveUtc: Date;
};

function addCalendarMonths(date: CalendarDate, months: number): CalendarDate {
  // Pure calendar-date arithmetic (UTC-neutral): JS Date month rollover handles
  // day-count edge cases (e.g. 31 Jan + 1 month) consistently.
  const d = new Date(Date.UTC(date.year, date.month - 1 + months, date.day));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export function addCalendarDays(date: CalendarDate, days: number): CalendarDate {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCalendarDate(iso: string): CalendarDate {
  const match = ISO_DATE_RE.exec(iso);
  if (!match) throw new Error(`Invalid ISO date: ${iso}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function formatCalendarDate(date: CalendarDate): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

const WEEKDAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

/** Weekday template key (`monday`..`sunday`) for a plain calendar date, timezone-independent. */
export function weekdayKeyForDate(date: CalendarDate): (typeof WEEKDAY_KEYS)[number] {
  const jsDay = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  return WEEKDAY_KEYS[jsDay];
}

export function getZoneABounds(now: Date, timeZone: string = KYIV_TZ): ZoneABounds {
  const today = getZonedDateParts(now, timeZone);
  const zoneAStartDate: CalendarDate = { year: today.year, month: today.month, day: today.day };
  const zoneAEndDate = addCalendarDays(addCalendarMonths(zoneAStartDate, 1), -1);
  const exclusiveDate = addCalendarDays(zoneAEndDate, 1);

  return {
    zoneAStartDate,
    zoneAEndDate,
    zoneAStartUtc: zonedTimeToUtc(zoneAStartDate.year, zoneAStartDate.month, zoneAStartDate.day, 0, 0, 0, timeZone),
    zoneAEndExclusiveUtc: zonedTimeToUtc(
      exclusiveDate.year,
      exclusiveDate.month,
      exclusiveDate.day,
      0,
      0,
      0,
      timeZone,
    ),
  };
}

/** `bookable(start)` from backend-spec.md: inside Zone A window and not already in the past. */
export function isWithinZoneA(instant: Date, bounds: ZoneABounds, now: Date): boolean {
  if (instant.getTime() < now.getTime()) return false;
  if (instant.getTime() < bounds.zoneAStartUtc.getTime()) return false;
  if (instant.getTime() >= bounds.zoneAEndExclusiveUtc.getTime()) return false;
  return true;
}

/** -1 if `a` is before `b`, 0 if equal, 1 if `a` is after `b`. */
export function compareCalendarDates(a: CalendarDate, b: CalendarDate): -1 | 0 | 1 {
  const av = a.year * 10000 + a.month * 100 + a.day;
  const bv = b.year * 10000 + b.month * 100 + b.day;
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}
