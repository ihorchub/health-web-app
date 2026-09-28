import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { patientProfiles } from "../db/schema/profiles.js";
import {
  addCalendarDays,
  formatCalendarDate,
  getZoneABounds,
  parseCalendarDate,
  weekdayKeyForDate,
  type CalendarDate,
} from "../lib/booking-horizon.js";
import { getZonedDateParts, zonedTimeToUtc } from "../lib/timezone.js";
import { ApiError } from "../lib/errors.js";
import { autoCompleteDueAppointments } from "./appointments.js";
import { dayBoundsUtc, loadDoctorForBooking, loadOccupancyInRange } from "./booking-validation.js";
import { generateDaySlots } from "./slots.js";

export type DoctorDashboardVisit = {
  id: string;
  patientDisplayName: string;
  startAt: string;
  format: "offline" | "online";
  reason: string | null;
  status: string;
  proposedStartAt: string | null;
};

export type DoctorDashboardResult = {
  date: string;
  metrics: {
    visitsToday: number;
    pendingCount: number;
    freeSlotsToday: number;
    cancellationsLast7Days: number;
  };
  visits: DoctorDashboardVisit[];
  nextVisit: DoctorDashboardVisit | null;
  pendingPatients: DoctorDashboardVisit[];
  freeWindowsToday: string[];
};

function toVisit(
  row: {
    id: string;
    startAt: Date;
    format: "offline" | "online";
    reason: string | null;
    status: string;
    proposedStartAt: Date | null;
    firstName: string;
    lastName: string;
  },
): DoctorDashboardVisit {
  return {
    id: row.id,
    patientDisplayName: `${row.firstName} ${row.lastName}`,
    startAt: row.startAt.toISOString(),
    format: row.format,
    reason: row.reason,
    status: row.status,
    proposedStartAt: row.proposedStartAt?.toISOString() ?? null,
  };
}

export async function getDoctorDashboard(input: {
  doctorId: string;
  date?: string;
  now?: Date;
}): Promise<DoctorDashboardResult> {
  const now = input.now ?? new Date();
  // R-02: flush due Upcoming → Completed before building the day view.
  await autoCompleteDueAppointments(now);

  const zoneBounds = getZoneABounds(now);
  let dateLocal: CalendarDate = zoneBounds.zoneAStartDate;
  if (input.date) {
    try {
      dateLocal = parseCalendarDate(input.date);
    } catch {
      throw new ApiError("AUTH_VALIDATION_FAILED", 400, { date: "INVALID" });
    }
  }
  const dateIso = formatCalendarDate(dateLocal);
  const { startUtc, endExclusiveUtc } = dayBoundsUtc(dateLocal);

  const db = getDb();
  const dayRows = await db
    .select({
      id: appointments.id,
      startAt: appointments.startAt,
      format: appointments.format,
      reason: appointments.reason,
      status: appointments.status,
      proposedStartAt: appointments.proposedStartAt,
      firstName: patientProfiles.firstName,
      lastName: patientProfiles.lastName,
    })
    .from(appointments)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, appointments.patientId))
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        gte(appointments.startAt, startUtc),
        lt(appointments.startAt, endExclusiveUtc),
        inArray(appointments.status, ["Upcoming", "Reschedule Pending"]),
      ),
    )
    .orderBy(appointments.startAt);

  const visits = dayRows.map(toVisit);
  const pendingPatients = visits.filter((v) => v.status === "Reschedule Pending");
  const nextVisit =
    visits.find((v) => new Date(v.startAt).getTime() >= now.getTime()) ?? visits[0] ?? null;

  const sevenDaysAgo = addCalendarDays(zoneBounds.zoneAStartDate, -7);
  const sevenStart = zonedTimeToUtc(sevenDaysAgo.year, sevenDaysAgo.month, sevenDaysAgo.day, 0, 0, 0);
  const [cancelAgg] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        eq(appointments.status, "Cancelled"),
        eq(appointments.cancelledBy, "doctor"),
        gte(appointments.startAt, sevenStart),
      ),
    );

  const doctor = await loadDoctorForBooking(input.doctorId);
  let freeWindowsToday: string[] = [];
  if (!doctor.vacationDates.includes(dateIso)) {
    const template = doctor.weeklyTemplate[weekdayKeyForDate(dateLocal)];
    const occupied = await loadOccupancyInRange(input.doctorId, startUtc, endExclusiveUtc);
    const slots = generateDaySlots({
      dateLocal,
      template,
      visitDurationMinutes: doctor.visitDurationMinutes,
      occupied,
      now,
      zoneBounds,
    });
    freeWindowsToday = slots.filter((s) => s.status === "free").map((s) => s.startAt);
  }

  // pending count across Zone A (not just today)
  const [pendingAgg] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(eq(appointments.doctorId, input.doctorId), eq(appointments.status, "Reschedule Pending")),
    );

  return {
    date: dateIso,
    metrics: {
      visitsToday: visits.length,
      pendingCount: Number(pendingAgg?.value ?? 0),
      freeSlotsToday: freeWindowsToday.length,
      cancellationsLast7Days: Number(cancelAgg?.value ?? 0),
    },
    visits,
    nextVisit,
    pendingPatients,
    freeWindowsToday,
  };
}
