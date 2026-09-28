/**
 * Shared slot-validity helpers used by both booking commands (appointments.ts) and the
 * calendar read endpoint (calendar.ts) — backend-spec.md "Slots and double booking".
 */
import { and, eq, inArray } from "drizzle-orm";

import {
  addCalendarDays,
  formatCalendarDate,
  getZoneABounds,
  weekdayKeyForDate,
  type CalendarDate,
} from "../lib/booking-horizon.js";
import { getZonedDateParts, zonedTimeToUtc } from "../lib/timezone.js";
import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorSchedules, type WeeklyTemplate } from "../db/schema/doctor-schedule.js";
import { doctorProfiles } from "../db/schema/profiles.js";
import { ApiError } from "../lib/errors.js";
import { generateDaySlots, type OccupancyEntry } from "./slots.js";

export type DoctorForBooking = {
  doctorId: string;
  visitDurationMinutes: number;
  supportedFormats: Array<"offline" | "online">;
  weeklyTemplate: WeeklyTemplate;
  vacationDates: string[];
};

const ACTIVE_STATUSES: Array<"Upcoming" | "Reschedule Pending"> = ["Upcoming", "Reschedule Pending"];

export async function loadDoctorForBooking(doctorId: string): Promise<DoctorForBooking> {
  const db = getDb();
  const [profile] = await db
    .select({ visitDurationMinutes: doctorProfiles.visitDurationMinutes })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorId))
    .limit(1);
  if (!profile) throw new ApiError("DOCTOR_NOT_FOUND", 404);

  const [schedule] = await db
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorUserId, doctorId))
    .limit(1);
  if (!schedule) throw new ApiError("DOCTOR_NOT_FOUND", 404);

  return {
    doctorId,
    visitDurationMinutes: profile.visitDurationMinutes,
    supportedFormats: schedule.supportedFormats as Array<"offline" | "online">,
    weeklyTemplate: schedule.weeklyTemplate as WeeklyTemplate,
    vacationDates: schedule.vacationDates ?? [],
  };
}

/** All taken/reserved instants for `doctorId` within `[rangeStartUtc, rangeEndExclusiveUtc)`. */
export async function loadOccupancyInRange(
  doctorId: string,
  rangeStartUtc: Date,
  rangeEndExclusiveUtc: Date,
  options?: { ignoreAppointmentId?: string },
): Promise<OccupancyEntry[]> {
  const rows = await getDb()
    .select({
      id: appointments.id,
      status: appointments.status,
      startAt: appointments.startAt,
      proposedStartAt: appointments.proposedStartAt,
    })
    .from(appointments)
    .where(and(eq(appointments.doctorId, doctorId), inArray(appointments.status, ACTIVE_STATUSES)));

  const inRange = (instant: Date) =>
    instant.getTime() >= rangeStartUtc.getTime() && instant.getTime() < rangeEndExclusiveUtc.getTime();

  const entries: OccupancyEntry[] = [];
  for (const row of rows) {
    if (options?.ignoreAppointmentId && row.id === options.ignoreAppointmentId) {
      // Still occupy original start_at for a pending row (patient holds original),
      // but ignore proposed_start_at so accept/revalidate of the proposal can succeed.
      if (inRange(row.startAt)) {
        entries.push({ startAt: row.startAt, status: "taken" });
      }
      continue;
    }
    if (inRange(row.startAt)) {
      entries.push({ startAt: row.startAt, status: "taken" });
    }
    if (row.status === "Reschedule Pending" && row.proposedStartAt && inRange(row.proposedStartAt)) {
      entries.push({ startAt: row.proposedStartAt, status: "reserved" });
    }
  }
  return entries;
}

export function dayBoundsUtc(dateLocal: CalendarDate): { startUtc: Date; endExclusiveUtc: Date } {
  const nextDay = addCalendarDays(dateLocal, 1);
  return {
    startUtc: zonedTimeToUtc(dateLocal.year, dateLocal.month, dateLocal.day, 0, 0, 0),
    endExclusiveUtc: zonedTimeToUtc(nextDay.year, nextDay.month, nextDay.day, 0, 0, 0),
  };
}

/** Throws SLOT_NOT_FREE / SLOT_OUTSIDE_WINDOW unless `startAt` is a currently-free slot. */
export async function validateSlotOrThrow(params: {
  doctor: DoctorForBooking;
  startAt: Date;
  now: Date;
  /** When accepting a proposal, ignore that appointment's reserved proposed slot. */
  ignoreAppointmentId?: string;
}): Promise<void> {
  const { doctor, startAt, now } = params;
  const zoneBounds = getZoneABounds(now);
  const local = getZonedDateParts(startAt);
  const dateLocal: CalendarDate = { year: local.year, month: local.month, day: local.day };
  const dateIso = formatCalendarDate(dateLocal);
  if (doctor.vacationDates.includes(dateIso)) {
    throw new ApiError("SLOT_NOT_FREE", 409);
  }
  const template = doctor.weeklyTemplate[weekdayKeyForDate(dateLocal)];

  const { startUtc, endExclusiveUtc } = dayBoundsUtc(dateLocal);
  const occupied = await loadOccupancyInRange(doctor.doctorId, startUtc, endExclusiveUtc, {
    ignoreAppointmentId: params.ignoreAppointmentId,
  });
  const slots = generateDaySlots({
    dateLocal,
    template,
    visitDurationMinutes: doctor.visitDurationMinutes,
    occupied,
    now,
    zoneBounds,
  });

  const match = slots.find((slot) => slot.startAt === startAt.toISOString());
  // Not a slot at all for this doctor/day (day off, before opening, mid-lunch, off-grid time).
  if (!match) throw new ApiError("SLOT_NOT_FREE", 409);
  if (match.status === "past") throw new ApiError("SLOT_OUTSIDE_WINDOW", 409);
  // Structurally a valid slot, but someone else already holds it (committed booking or a
  // concurrent writer this check just lost to) — FLO-06's "stale confirm" case.
  if (match.status !== "free") throw new ApiError("SLOT_TAKEN", 409);
}
