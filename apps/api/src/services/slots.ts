/**
 * Slot generation ("compute on read") — backend-spec.md "Slots and double booking".
 *
 * Free times are never pre-stored; they are computed from the doctor's weekly template
 * plus current appointment occupancy every time the calendar is read.
 */

import type { CalendarDate, ZoneABounds } from "../lib/booking-horizon.js";
import { compareCalendarDates, isWithinZoneA } from "../lib/booking-horizon.js";
import { KYIV_TZ, zonedTimeToUtc } from "../lib/timezone.js";
import type { WeeklyDayTemplate } from "../db/schema/doctor-schedule.js";

export type SlotStatus = "free" | "taken" | "reserved" | "past";

export type CalendarSlot = {
  startAt: string;
  status: SlotStatus;
};

export type OccupancyEntry = {
  startAt: Date;
  status: "taken" | "reserved";
};

export type GenerateDaySlotsInput = {
  dateLocal: CalendarDate;
  template: WeeklyDayTemplate;
  visitDurationMinutes: number;
  occupied: OccupancyEntry[];
  now: Date;
  zoneBounds: ZoneABounds;
  timeZone?: string;
};

function parseHHMM(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

/** Minutes since local midnight, for simple range/overlap arithmetic. */
function toMinutes({ hour, minute }: { hour: number; minute: number }): number {
  return hour * 60 + minute;
}

export function generateDaySlots(input: GenerateDaySlotsInput): CalendarSlot[] {
  const { dateLocal, template, visitDurationMinutes, occupied, now, zoneBounds, timeZone = KYIV_TZ } = input;

  if (!template.works || !template.start || !template.end) {
    return [];
  }

  const startMin = toMinutes(parseHHMM(template.start));
  const endMin = toMinutes(parseHHMM(template.end));
  const lunchStartMin = template.lunchStart ? toMinutes(parseHHMM(template.lunchStart)) : null;
  const lunchEndMin = template.lunchEnd ? toMinutes(parseHHMM(template.lunchEnd)) : null;

  const occupiedByInstant = new Map<number, "taken" | "reserved">();
  for (const entry of occupied) {
    occupiedByInstant.set(entry.startAt.getTime(), entry.status);
  }

  const slots: CalendarSlot[] = [];

  for (let candidateMin = startMin; candidateMin + visitDurationMinutes <= endMin; candidateMin += visitDurationMinutes) {
    const candidateEndMin = candidateMin + visitDurationMinutes;

    if (lunchStartMin !== null && lunchEndMin !== null) {
      const overlapsLunch = candidateMin < lunchEndMin && candidateEndMin > lunchStartMin;
      if (overlapsLunch) continue;
    }

    const hour = Math.floor(candidateMin / 60);
    const minute = candidateMin % 60;
    const instant = zonedTimeToUtc(dateLocal.year, dateLocal.month, dateLocal.day, hour, minute, 0, timeZone);

    const occupancy = occupiedByInstant.get(instant.getTime());
    let status: SlotStatus;
    if (occupancy) {
      status = occupancy;
    } else if (!isWithinZoneA(instant, zoneBounds, now)) {
      status = "past";
    } else {
      status = "free";
    }

    slots.push({ startAt: instant.toISOString(), status });
  }

  return slots;
}

export type DayFlag = "has_free" | "full" | "day_off" | "outside_window" | "past";

export type GetDayFlagInput = {
  dateLocal: CalendarDate;
  template: WeeklyDayTemplate;
  zoneBounds: ZoneABounds;
  /** Slots already generated for `dateLocal` via `generateDaySlots`. */
  slots: CalendarSlot[];
};

/** Day-level summary flag for the two-month calendar UI (SCR-04). */
export function getDayFlag(input: GetDayFlagInput): DayFlag {
  const { dateLocal, template, zoneBounds, slots } = input;

  if (compareCalendarDates(dateLocal, zoneBounds.zoneAStartDate) < 0) return "past";
  if (compareCalendarDates(dateLocal, zoneBounds.zoneAEndDate) > 0) return "outside_window";
  if (!template.works) return "day_off";

  return slots.some((slot) => slot.status === "free") ? "has_free" : "full";
}
