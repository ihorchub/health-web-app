/**
 * Timezone helpers for the clinic timezone (Europe/Kyiv — Confirmed 31 Aug 2026, backend-spec.md).
 *
 * All appointment math (Zone A/B bounds, slot generation) happens in Kyiv local time,
 * but is stored/compared as UTC instants (`timestamptz`). These helpers convert between
 * a Kyiv wall-clock time and the UTC instant it represents, using the ICU tz database
 * built into Node — correct across DST without hardcoding an offset.
 */

export const KYIV_TZ = "Europe/Kyiv";

export type ZonedDateParts = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** ISO weekday: Monday = 1 ... Sunday = 7 */
  weekday: number;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
}

/** Reads the wall-clock date/time parts of a UTC instant, as seen in `timeZone`. */
export function getZonedDateParts(date: Date, timeZone: string = KYIV_TZ): ZonedDateParts {
  const parts = formatterFor(timeZone).formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAY_INDEX[map.weekday] ?? 1,
  };
}

/**
 * Converts a Kyiv wall-clock time (year/month/day/hour/minute/second) to the UTC instant
 * it represents. Handles EET/EEST (or any future tz rule change) via the ICU tz database.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  timeZone: string = KYIV_TZ,
): Date {
  // Guess: treat the wall-clock time as if it were UTC, then measure how far off
  // that guess is when read back in `timeZone`, and correct for the difference.
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const seenInZone = getZonedDateParts(utcGuess, timeZone);
  const seenAsUtc = Date.UTC(
    seenInZone.year,
    seenInZone.month - 1,
    seenInZone.day,
    seenInZone.hour,
    seenInZone.minute,
    seenInZone.second,
  );
  const offsetMs = seenAsUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offsetMs);
}
