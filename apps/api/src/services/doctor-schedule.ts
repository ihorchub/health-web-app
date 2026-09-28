import { and, eq, gte, inArray, lt } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import * as schema from "../db/schema/index.js";
import {
  defaultWeeklyTemplate,
  doctorSchedules,
  type WeeklyTemplate,
} from "../db/schema/doctor-schedule.js";
import { doctorProfiles } from "../db/schema/index.js";
import {
  addCalendarDays,
  compareCalendarDates,
  formatCalendarDate,
  getZoneABounds,
  parseCalendarDate,
  type CalendarDate,
} from "../lib/booking-horizon.js";
import { ApiError } from "../lib/errors.js";
import { getZonedDateParts, zonedTimeToUtc } from "../lib/timezone.js";
import { cancelAppointment } from "./appointments.js";

type Db = NodePgDatabase<typeof schema>;

function addCalendarMonths(date: CalendarDate, months: number): CalendarDate {
  const d = new Date(Date.UTC(date.year, date.month - 1 + months, date.day));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export function getZoneBBounds(now: Date) {
  const zoneA = getZoneABounds(now);
  const zoneBStartDate = addCalendarDays(zoneA.zoneAEndDate, 1);
  const today = zoneA.zoneAStartDate;
  const zoneBEndDate = addCalendarDays(addCalendarMonths(today, 3), -1);
  return {
    zoneA,
    zoneBStartDate,
    zoneBEndDate,
    zoneBStart: formatCalendarDate(zoneBStartDate),
    zoneBEnd: formatCalendarDate(zoneBEndDate),
  };
}

export async function createDefaultDoctorSchedule(db: Db, doctorUserId: string): Promise<void> {
  await db.insert(doctorSchedules).values({
    doctorUserId,
    basePriceUah: 600,
    supportedFormats: ["offline"],
    weeklyTemplate: defaultWeeklyTemplate,
    vacationDates: [],
    visibleInSearch: true,
  });
}

export async function getDoctorScheduleForUser(doctorUserId: string, now: Date = new Date()) {
  const [schedule] = await getDb()
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorUserId, doctorUserId))
    .limit(1);

  if (!schedule) {
    throw new ApiError("SCHEDULE_FORBIDDEN", 404);
  }

  const [profile] = await getDb()
    .select({
      visitDurationMinutes: doctorProfiles.visitDurationMinutes,
      specialty: doctorProfiles.specialty,
    })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorUserId))
    .limit(1);

  const bounds = getZoneBBounds(now);

  return {
    doctorUserId,
    basePriceUah: schedule.basePriceUah,
    promoPriceUah: schedule.promoPriceUah,
    promoValidUntil: schedule.promoValidUntil,
    supportedFormats: schedule.supportedFormats,
    weeklyTemplate: schedule.weeklyTemplate as WeeklyTemplate,
    vacationDates: schedule.vacationDates ?? [],
    visibleInSearch: schedule.visibleInSearch,
    visitDurationMinutes: profile?.visitDurationMinutes ?? 30,
    specialty: profile?.specialty,
    zoneAStart: formatCalendarDate(bounds.zoneA.zoneAStartDate),
    zoneAEnd: formatCalendarDate(bounds.zoneA.zoneAEndDate),
    zoneBStart: bounds.zoneBStart,
    zoneBEnd: bounds.zoneBEnd,
    frozenInZoneA: {
      hours: true,
      duration: true,
      basePrice: true,
    },
  };
}

export type PatchScheduleInput = {
  /** Zone B planning — updates the stored weekly template (single template MVP). */
  zoneBWeeklyTemplate?: WeeklyTemplate;
  zoneBVisitDurationMinutes?: number;
  vacationDates?: string[];
  supportedFormats?: Array<"offline" | "online">;
  basePriceUah?: number;
  basePriceEffectiveFrom?: string;
  promoPriceUah?: number | null;
  promoValidUntil?: string | null;
  /** Rejected when set — use zoneB* fields for hours/duration. */
  weeklyTemplate?: WeeklyTemplate;
  visitDurationMinutes?: number;
};

export async function patchDoctorSchedule(
  doctorUserId: string,
  body: PatchScheduleInput,
  now: Date = new Date(),
) {
  const zoneA = getZoneABounds(now);

  if (body.weeklyTemplate != null) {
    throw new ApiError("SCHEDULE_ZONE_FROZEN", 409, { field: "weeklyTemplate" });
  }
  if (body.visitDurationMinutes != null) {
    throw new ApiError("SCHEDULE_ZONE_FROZEN", 409, { field: "visitDurationMinutes" });
  }

  const patch: Partial<typeof doctorSchedules.$inferInsert> = {};

  if (body.basePriceUah != null) {
    const effectiveFrom = body.basePriceEffectiveFrom
      ? parseCalendarDate(body.basePriceEffectiveFrom)
      : addCalendarDays(zoneA.zoneAEndDate, 1);
    if (compareCalendarDates(effectiveFrom, addCalendarDays(zoneA.zoneAEndDate, 1)) < 0) {
      throw new ApiError("SCHEDULE_ZONE_FROZEN", 409, { field: "basePriceUah" });
    }
    patch.basePriceUah = body.basePriceUah;
  }

  if (body.promoPriceUah !== undefined) patch.promoPriceUah = body.promoPriceUah;
  if (body.promoValidUntil !== undefined) patch.promoValidUntil = body.promoValidUntil;
  if (body.supportedFormats) patch.supportedFormats = body.supportedFormats;

  if (body.vacationDates) {
    for (const iso of body.vacationDates) {
      const date = parseCalendarDate(iso);
      if (
        compareCalendarDates(date, zoneA.zoneAStartDate) >= 0 &&
        compareCalendarDates(date, zoneA.zoneAEndDate) <= 0
      ) {
        const startUtc = zonedTimeToUtc(date.year, date.month, date.day, 0, 0, 0);
        const next = addCalendarDays(date, 1);
        const endUtc = zonedTimeToUtc(next.year, next.month, next.day, 0, 0, 0);
        const [busy] = await getDb()
          .select({ id: appointments.id })
          .from(appointments)
          .where(
            and(
              eq(appointments.doctorId, doctorUserId),
              gte(appointments.startAt, startUtc),
              lt(appointments.startAt, endUtc),
              inArray(appointments.status, ["Upcoming", "Reschedule Pending"]),
            ),
          )
          .limit(1);
        if (busy) {
          throw new ApiError("SCHEDULE_VALIDATION_FAILED", 409, { vacationDates: "DAY_NOT_EMPTY" });
        }
      }
    }
    patch.vacationDates = body.vacationDates;
  }

  if (body.zoneBWeeklyTemplate) {
    patch.weeklyTemplate = body.zoneBWeeklyTemplate;
  }

  if (body.zoneBVisitDurationMinutes != null) {
    if (![20, 30, 45].includes(body.zoneBVisitDurationMinutes)) {
      throw new ApiError("SCHEDULE_VALIDATION_FAILED", 400, { visitDurationMinutes: "INVALID" });
    }
    await getDb()
      .update(doctorProfiles)
      .set({ visitDurationMinutes: body.zoneBVisitDurationMinutes })
      .where(eq(doctorProfiles.userId, doctorUserId));
  }

  if (Object.keys(patch).length > 0) {
    await getDb().update(doctorSchedules).set(patch).where(eq(doctorSchedules.doctorUserId, doctorUserId));
  }

  return getDoctorScheduleForUser(doctorUserId, now);
}

export type BulkCancelScope = "whole_day" | "rest_of_day" | "rest_of_week" | "custom_range";

export async function bulkCancelAppointments(input: {
  doctorId: string;
  scope: BulkCancelScope;
  from?: string;
  to?: string;
  confirm: boolean;
  now?: Date;
}): Promise<{ cancelledIds: string[] }> {
  if (!input.confirm) throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { confirm: "REQUIRED" });

  const now = input.now ?? new Date();
  const zoneA = getZoneABounds(now);
  const todayParts = getZonedDateParts(now);

  let rangeStart: CalendarDate;
  let rangeEnd: CalendarDate;
  let startUtc: Date;
  let endExclusiveUtc: Date;

  switch (input.scope) {
    case "whole_day": {
      if (!input.from) throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { from: "REQUIRED" });
      rangeStart = parseCalendarDate(input.from);
      rangeEnd = rangeStart;
      startUtc = zonedTimeToUtc(rangeStart.year, rangeStart.month, rangeStart.day, 0, 0, 0);
      const next = addCalendarDays(rangeStart, 1);
      endExclusiveUtc = zonedTimeToUtc(next.year, next.month, next.day, 0, 0, 0);
      break;
    }
    case "rest_of_day": {
      rangeStart = { year: todayParts.year, month: todayParts.month, day: todayParts.day };
      rangeEnd = rangeStart;
      startUtc = now;
      const next = addCalendarDays(rangeStart, 1);
      endExclusiveUtc = zonedTimeToUtc(next.year, next.month, next.day, 0, 0, 0);
      break;
    }
    case "rest_of_week": {
      rangeStart = { year: todayParts.year, month: todayParts.month, day: todayParts.day };
      const jsDay = new Date(Date.UTC(rangeStart.year, rangeStart.month - 1, rangeStart.day)).getUTCDay();
      const daysUntilSunday = jsDay === 0 ? 0 : 7 - jsDay;
      rangeEnd = addCalendarDays(rangeStart, daysUntilSunday);
      startUtc = now;
      const next = addCalendarDays(rangeEnd, 1);
      endExclusiveUtc = zonedTimeToUtc(next.year, next.month, next.day, 0, 0, 0);
      break;
    }
    case "custom_range": {
      if (!input.from || !input.to) {
        throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { from: "REQUIRED", to: "REQUIRED" });
      }
      rangeStart = parseCalendarDate(input.from);
      rangeEnd = parseCalendarDate(input.to);
      if (compareCalendarDates(rangeEnd, rangeStart) < 0) {
        throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { range: "INVALID" });
      }
      startUtc = zonedTimeToUtc(rangeStart.year, rangeStart.month, rangeStart.day, 0, 0, 0);
      const next = addCalendarDays(rangeEnd, 1);
      endExclusiveUtc = zonedTimeToUtc(next.year, next.month, next.day, 0, 0, 0);
      break;
    }
    default:
      throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { scope: "INVALID" });
  }

  if (
    compareCalendarDates(rangeStart, zoneA.zoneAStartDate) < 0 ||
    compareCalendarDates(rangeEnd, zoneA.zoneAEndDate) > 0
  ) {
    throw new ApiError("BULK_CANCEL_INVALID_SCOPE", 400, { range: "OUTSIDE_ZONE_A" });
  }

  const rows = await getDb()
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        gte(appointments.startAt, startUtc),
        lt(appointments.startAt, endExclusiveUtc),
        inArray(appointments.status, ["Upcoming", "Reschedule Pending"]),
      ),
    );

  const cancelledIds: string[] = [];
  for (const row of rows) {
    await cancelAppointment({
      appointmentId: row.id,
      actorId: input.doctorId,
      actorRole: "doctor",
    });
    cancelledIds.push(row.id);
  }

  return { cancelledIds };
}
