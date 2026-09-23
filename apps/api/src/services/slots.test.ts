import { describe, expect, it } from "vitest";

import { getZoneABounds } from "../lib/booking-horizon.js";
import { zonedTimeToUtc } from "../lib/timezone.js";
import { generateDaySlots, getDayFlag } from "./slots.js";

const WORKING_DAY = {
  works: true,
  start: "09:00",
  end: "18:00",
  lunchStart: "13:00",
  lunchEnd: "14:00",
};

const DAY_OFF = { works: false };

describe("generateDaySlots", () => {
  it("returns no slots for a day off", () => {
    const now = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 8, day: 11 },
      template: DAY_OFF,
      visitDurationMinutes: 30,
      occupied: [],
      now,
      zoneBounds: getZoneABounds(now),
    });
    expect(slots).toEqual([]);
  });

  it("generates 30-minute slots 09:00-18:00 with a 13:00-14:00 lunch break excluded", () => {
    const now = zonedTimeToUtc(2026, 8, 1, 0, 0, 0); // well before the day, everything is free
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 8, day: 11 },
      template: WORKING_DAY,
      visitDurationMinutes: 30,
      occupied: [],
      now,
      zoneBounds: getZoneABounds(now),
    });

    // 09:00..12:30 (8 slots) + 14:00..17:30 (8 slots) = 16 slots, none during lunch
    expect(slots).toHaveLength(16);
    expect(slots.every((s) => s.status === "free")).toBe(true);
    expect(slots[0].startAt).toBe(zonedTimeToUtc(2026, 8, 11, 9, 0, 0).toISOString());
    expect(slots.some((s) => s.startAt === zonedTimeToUtc(2026, 8, 11, 13, 0, 0).toISOString())).toBe(false);
    expect(slots.some((s) => s.startAt === zonedTimeToUtc(2026, 8, 11, 13, 30, 0).toISOString())).toBe(false);
    expect(slots[slots.length - 1].startAt).toBe(zonedTimeToUtc(2026, 8, 11, 17, 30, 0).toISOString());
  });

  it("excludes a trailing slot that would not fully fit before closing time", () => {
    const now = zonedTimeToUtc(2026, 8, 1, 0, 0, 0);
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 8, day: 11 },
      template: { works: true, start: "09:00", end: "09:50" },
      visitDurationMinutes: 45,
      occupied: [],
      now,
      zoneBounds: getZoneABounds(now),
    });
    // Only one 45-min slot (09:00-09:45) fits; a second would end at 10:35, past close.
    expect(slots).toHaveLength(1);
    expect(slots[0].startAt).toBe(zonedTimeToUtc(2026, 8, 11, 9, 0, 0).toISOString());
  });

  it("marks an occupied instant as taken or reserved instead of free", () => {
    const now = zonedTimeToUtc(2026, 8, 1, 0, 0, 0);
    const takenAt = zonedTimeToUtc(2026, 8, 11, 10, 0, 0);
    const reservedAt = zonedTimeToUtc(2026, 8, 11, 10, 30, 0);
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 8, day: 11 },
      template: WORKING_DAY,
      visitDurationMinutes: 30,
      occupied: [
        { startAt: takenAt, status: "taken" },
        { startAt: reservedAt, status: "reserved" },
      ],
      now,
      zoneBounds: getZoneABounds(now),
    });

    const taken = slots.find((s) => s.startAt === takenAt.toISOString());
    const reserved = slots.find((s) => s.startAt === reservedAt.toISOString());
    expect(taken?.status).toBe("taken");
    expect(reserved?.status).toBe("reserved");
  });

  it("marks a slot before `now` as past even though it is otherwise free", () => {
    // `now` is 10:15 Kyiv on the requested day -> the 09:00 and 10:00 slots are already gone.
    const now = zonedTimeToUtc(2026, 8, 11, 10, 15, 0);
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 8, day: 11 },
      template: WORKING_DAY,
      visitDurationMinutes: 30,
      occupied: [],
      now,
      zoneBounds: getZoneABounds(now),
    });

    expect(slots.find((s) => s.startAt === zonedTimeToUtc(2026, 8, 11, 9, 0, 0).toISOString())?.status).toBe(
      "past",
    );
    expect(slots.find((s) => s.startAt === zonedTimeToUtc(2026, 8, 11, 10, 30, 0).toISOString())?.status).toBe(
      "free",
    );
  });

  it("marks a slot outside the Zone A window as past even if `now` has not reached it", () => {
    const now = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);
    const bounds = getZoneABounds(now); // zoneAEnd = 2026-09-09
    const slots = generateDaySlots({
      dateLocal: { year: 2026, month: 9, day: 10 }, // one day past zoneAEnd
      template: WORKING_DAY,
      visitDurationMinutes: 30,
      occupied: [],
      now,
      zoneBounds: bounds,
    });

    expect(slots.every((s) => s.status === "past")).toBe(true);
  });
});

describe("getDayFlag", () => {
  const now = zonedTimeToUtc(2026, 8, 10, 8, 0, 0); // today = 10 Aug, zoneAEnd = 9 Sep
  const bounds = getZoneABounds(now);

  it("flags a day before today as past", () => {
    const dateLocal = { year: 2026, month: 8, day: 9 };
    const slots = generateDaySlots({ dateLocal, template: WORKING_DAY, visitDurationMinutes: 30, occupied: [], now, zoneBounds: bounds });
    expect(getDayFlag({ dateLocal, template: WORKING_DAY, zoneBounds: bounds, slots })).toBe("past");
  });

  it("flags a day after zoneAEnd as outside_window", () => {
    const dateLocal = { year: 2026, month: 9, day: 10 };
    const slots = generateDaySlots({ dateLocal, template: WORKING_DAY, visitDurationMinutes: 30, occupied: [], now, zoneBounds: bounds });
    expect(getDayFlag({ dateLocal, template: WORKING_DAY, zoneBounds: bounds, slots })).toBe("outside_window");
  });

  it("flags a non-working day as day_off", () => {
    const dateLocal = { year: 2026, month: 8, day: 15 }; // Saturday
    const slots = generateDaySlots({ dateLocal, template: DAY_OFF, visitDurationMinutes: 30, occupied: [], now, zoneBounds: bounds });
    expect(getDayFlag({ dateLocal, template: DAY_OFF, zoneBounds: bounds, slots })).toBe("day_off");
  });

  it("flags a working day inside the window with at least one free slot as has_free", () => {
    const dateLocal = { year: 2026, month: 8, day: 11 };
    const slots = generateDaySlots({ dateLocal, template: WORKING_DAY, visitDurationMinutes: 30, occupied: [], now, zoneBounds: bounds });
    expect(getDayFlag({ dateLocal, template: WORKING_DAY, zoneBounds: bounds, slots })).toBe("has_free");
  });

  it("flags a working day inside the window with no free slots left as full", () => {
    const dateLocal = { year: 2026, month: 8, day: 11 };
    const takenNow = zonedTimeToUtc(2026, 8, 11, 23, 59, 0); // after this day's last slot -> all past
    const slots = generateDaySlots({
      dateLocal,
      template: WORKING_DAY,
      visitDurationMinutes: 30,
      occupied: [],
      now: takenNow,
      zoneBounds: getZoneABounds(now),
    });
    expect(getDayFlag({ dateLocal, template: WORKING_DAY, zoneBounds: bounds, slots })).toBe("full");
  });
});
