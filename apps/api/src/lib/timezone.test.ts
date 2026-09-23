import { describe, expect, it } from "vitest";

import { getZonedDateParts, KYIV_TZ, zonedTimeToUtc } from "./timezone.js";

describe("zonedTimeToUtc", () => {
  it("converts Kyiv winter midnight (EET, UTC+2) to the correct UTC instant", () => {
    // 15 Jan 2026 00:00 Europe/Kyiv == 14 Jan 2026 22:00 UTC (EET = UTC+2)
    const result = zonedTimeToUtc(2026, 1, 15, 0, 0, 0);
    expect(result.toISOString()).toBe("2026-01-14T22:00:00.000Z");
  });

  it("converts Kyiv summer midday (EEST, UTC+3) to the correct UTC instant", () => {
    // 15 Jul 2026 12:00 Europe/Kyiv == 15 Jul 2026 09:00 UTC (EEST = UTC+3)
    const result = zonedTimeToUtc(2026, 7, 15, 12, 0, 0);
    expect(result.toISOString()).toBe("2026-07-15T09:00:00.000Z");
  });

  it("round-trips through getZonedDateParts", () => {
    const utc = zonedTimeToUtc(2026, 3, 10, 9, 30, 0);
    const parts = getZonedDateParts(utc, KYIV_TZ);
    expect(parts).toMatchObject({ year: 2026, month: 3, day: 10, hour: 9, minute: 30 });
  });
});

describe("getZonedDateParts", () => {
  it("reads out year/month/day/hour/minute/weekday for a known UTC instant", () => {
    // 2026-08-10T21:30:00Z -> summer in Kyiv (+3) -> 2026-08-11 00:30 local, Tuesday
    const parts = getZonedDateParts(new Date("2026-08-10T21:30:00.000Z"), KYIV_TZ);
    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(8);
    expect(parts.day).toBe(11);
    expect(parts.hour).toBe(0);
    expect(parts.minute).toBe(30);
    expect(parts.weekday).toBe(2); // Tuesday, Monday = 1 ... Sunday = 7
  });
});
