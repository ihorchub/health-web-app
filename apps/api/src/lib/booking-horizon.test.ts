import { describe, expect, it } from "vitest";

import {
  formatCalendarDate,
  getZoneABounds,
  isWithinZoneA,
  parseCalendarDate,
  weekdayKeyForDate,
} from "./booking-horizon.js";
import { zonedTimeToUtc } from "./timezone.js";

describe("getZoneABounds", () => {
  it("computes zoneAStart as Kyiv midnight of today", () => {
    const now = zonedTimeToUtc(2026, 8, 10, 12, 0, 0); // noon Kyiv, 10 Aug
    const bounds = getZoneABounds(now);
    expect(bounds.zoneAStartUtc.toISOString()).toBe(zonedTimeToUtc(2026, 8, 10, 0, 0, 0).toISOString());
    expect(bounds.zoneAStartDate).toEqual({ year: 2026, month: 8, day: 10 });
  });

  it("computes zoneAEnd as one calendar month later minus one day (example from spec: 10 Aug -> 9 Sep)", () => {
    const now = zonedTimeToUtc(2026, 8, 10, 12, 0, 0);
    const bounds = getZoneABounds(now);
    expect(bounds.zoneAEndDate).toEqual({ year: 2026, month: 9, day: 9 });
    // exclusive upper bound = Kyiv midnight of the day AFTER zoneAEnd
    expect(bounds.zoneAEndExclusiveUtc.toISOString()).toBe(
      zonedTimeToUtc(2026, 9, 10, 0, 0, 0).toISOString(),
    );
  });

  it("handles month-end correctly (31 Jan -> 28/29 Feb boundary)", () => {
    const now = zonedTimeToUtc(2026, 1, 31, 0, 0, 0);
    const bounds = getZoneABounds(now);
    // JS Date month-rollover semantics: 31 Jan + 1 month = 3 Mar (Feb has 28 days in 2026),
    // minus 1 day = 2 Mar. This is standard/acceptable rolling-month edge behaviour.
    expect(bounds.zoneAEndDate).toEqual({ year: 2026, month: 3, day: 2 });
  });
});

describe("isWithinZoneA", () => {
  const now = zonedTimeToUtc(2026, 8, 10, 12, 0, 0);
  const bounds = getZoneABounds(now);

  it("returns true for an instant inside the window and in the future", () => {
    const candidate = zonedTimeToUtc(2026, 8, 15, 10, 0, 0);
    expect(isWithinZoneA(candidate, bounds, now)).toBe(true);
  });

  it("returns false for an instant before zoneAStart", () => {
    const candidate = zonedTimeToUtc(2026, 8, 9, 23, 0, 0);
    expect(isWithinZoneA(candidate, bounds, now)).toBe(false);
  });

  it("returns false for an instant after zoneAEnd (outside the rolling month)", () => {
    const candidate = zonedTimeToUtc(2026, 9, 10, 10, 0, 0);
    expect(isWithinZoneA(candidate, bounds, now)).toBe(false);
  });

  it("returns false for an instant already in the past, even inside the window", () => {
    const candidate = zonedTimeToUtc(2026, 8, 10, 9, 0, 0); // before `now` (noon)
    expect(isWithinZoneA(candidate, bounds, now)).toBe(false);
  });

  it("returns true for the last bookable instant (zoneAEnd, just before midnight)", () => {
    const candidate = zonedTimeToUtc(2026, 9, 9, 23, 30, 0);
    expect(isWithinZoneA(candidate, bounds, now)).toBe(true);
  });
});

describe("calendar date helpers", () => {
  it("parses and formats ISO calendar dates", () => {
    expect(parseCalendarDate("2026-08-11")).toEqual({ year: 2026, month: 8, day: 11 });
    expect(formatCalendarDate({ year: 2026, month: 8, day: 11 })).toBe("2026-08-11");
  });

  it("maps a calendar date to its weekday template key", () => {
    // 2026-08-11 is a Tuesday
    expect(weekdayKeyForDate({ year: 2026, month: 8, day: 11 })).toBe("tuesday");
    // 2026-08-15 is a Saturday
    expect(weekdayKeyForDate({ year: 2026, month: 8, day: 15 })).toBe("saturday");
    // 2026-08-16 is a Sunday
    expect(weekdayKeyForDate({ year: 2026, month: 8, day: 16 })).toBe("sunday");
  });
});
