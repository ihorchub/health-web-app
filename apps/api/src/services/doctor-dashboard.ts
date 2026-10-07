import { and, desc, eq, gte, inArray, lt } from "drizzle-orm";

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
import { runAppointmentMaintenance } from "./appointments.js";
import { dayBoundsUtc, loadDoctorForBooking, loadOccupancyInRange } from "./booking-validation.js";
import { generateDaySlots } from "./slots.js";

export type DoctorDashboardVisit = {
  id: string;
  patientDisplayName: string;
  patientPhotoUrl: string | null;
  startAt: string;
  format: "offline" | "online";
  reason: string | null;
  status: string;
  proposedStartAt: string | null;
};

export type DoctorWeekStripDay = {
  date: string;
  visits: number;
  pending: number;
  cancelled: number;
  free: number;
};

export type DoctorDashboardResult = {
  date: string;
  metrics: {
    visitsToday: number;
    pendingCount: number;
    freeSlotsToday: number;
    cancellationsLast7Days: number;
    /** Completed visits from the 1st of the current month (Kyiv) through now. */
    pastVisitsThisMonth: number;
  };
  visits: DoctorDashboardVisit[];
  nextVisit: DoctorDashboardVisit | null;
  pendingPatients: DoctorDashboardVisit[];
  /** Completed visits from month start (Kyiv) — SCR-08 “past visits” tab. */
  pastVisitsMonth: DoctorDashboardVisit[];
  /** Cancelled-by-doctor visits in the last 7 days (Kyiv) — SCR-08 cancellations tab. */
  cancellationsLast7Days: DoctorDashboardVisit[];
  freeWindowsToday: string[];
  /** Mon–Sun strip for the week containing `date` (Kyiv). Dot counts for SCR-08 sidebar. */
  weekStrip: DoctorWeekStripDay[];
};

function mondayOfWeek(date: CalendarDate): CalendarDate {
  const jsDay = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  const mondayOffset = (jsDay + 6) % 7;
  return addCalendarDays(date, -mondayOffset);
}

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
    photoUrl: string | null;
  },
): DoctorDashboardVisit {
  return {
    id: row.id,
    patientDisplayName: `${row.firstName} ${row.lastName}`,
    patientPhotoUrl: row.photoUrl,
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
  // Expire unanswered proposals, then R-02 auto-complete due Upcoming.
  await runAppointmentMaintenance(now);

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
      photoUrl: patientProfiles.photoUrl,
    })
    .from(appointments)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, appointments.patientId))
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        gte(appointments.startAt, startUtc),
        lt(appointments.startAt, endExclusiveUtc),
        inArray(appointments.status, ["Upcoming", "Completed", "Cancelled", "Rescheduled"]),
      ),
    )
    .orderBy(appointments.startAt);

  const visits = dayRows.map(toVisit);
  const activeVisits = visits.filter((v) => v.status === "Upcoming");
  const nextVisit =
    activeVisits.find((v) => new Date(v.startAt).getTime() >= now.getTime()) ??
    activeVisits[0] ??
    null;

  const sevenDaysAgo = addCalendarDays(zoneBounds.zoneAStartDate, -7);
  const sevenStart = zonedTimeToUtc(sevenDaysAgo.year, sevenDaysAgo.month, sevenDaysAgo.day, 0, 0, 0);
  const cancellationRows = await db
    .select({
      id: appointments.id,
      startAt: appointments.startAt,
      format: appointments.format,
      reason: appointments.reason,
      status: appointments.status,
      proposedStartAt: appointments.proposedStartAt,
      firstName: patientProfiles.firstName,
      lastName: patientProfiles.lastName,
      photoUrl: patientProfiles.photoUrl,
    })
    .from(appointments)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, appointments.patientId))
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        eq(appointments.status, "Cancelled"),
        eq(appointments.cancelledBy, "doctor"),
        gte(appointments.startAt, sevenStart),
      ),
    )
    .orderBy(desc(appointments.startAt));
  const cancellationsLast7Days = cancellationRows.map(toVisit);

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

  const nowParts = getZonedDateParts(now);
  const monthStartLocal: CalendarDate = { year: nowParts.year, month: nowParts.month, day: 1 };
  const monthStartUtc = zonedTimeToUtc(
    monthStartLocal.year,
    monthStartLocal.month,
    monthStartLocal.day,
    0,
    0,
    0,
  );

  const monthPastRows = await db
    .select({
      id: appointments.id,
      startAt: appointments.startAt,
      format: appointments.format,
      reason: appointments.reason,
      status: appointments.status,
      proposedStartAt: appointments.proposedStartAt,
      firstName: patientProfiles.firstName,
      lastName: patientProfiles.lastName,
      photoUrl: patientProfiles.photoUrl,
    })
    .from(appointments)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, appointments.patientId))
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        eq(appointments.status, "Completed"),
        gte(appointments.startAt, monthStartUtc),
        lt(appointments.startAt, now),
      ),
    )
    .orderBy(appointments.startAt);

  const pastVisitsMonth = monthPastRows.map(toVisit);

  const weekStart = mondayOfWeek(dateLocal);
  const weekEndExclusive = addCalendarDays(weekStart, 7);
  const weekStartUtc = zonedTimeToUtc(weekStart.year, weekStart.month, weekStart.day, 0, 0, 0);
  const weekEndUtc = zonedTimeToUtc(
    weekEndExclusive.year,
    weekEndExclusive.month,
    weekEndExclusive.day,
    0,
    0,
    0,
  );

  const weekRows = await db
    .select({
      startAt: appointments.startAt,
      status: appointments.status,
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, input.doctorId),
        gte(appointments.startAt, weekStartUtc),
        lt(appointments.startAt, weekEndUtc),
        inArray(appointments.status, ["Upcoming", "Cancelled", "Completed"]),
      ),
    );

  const byDate = new Map<string, { visits: number; cancelled: number }>();
  for (let i = 0; i < 7; i += 1) {
    byDate.set(formatCalendarDate(addCalendarDays(weekStart, i)), {
      visits: 0,
      cancelled: 0,
    });
  }
  for (const row of weekRows) {
    const parts = getZonedDateParts(row.startAt);
    const key = formatCalendarDate({ year: parts.year, month: parts.month, day: parts.day });
    const bucket = byDate.get(key);
    if (!bucket) continue;
    if (row.status === "Cancelled") {
      bucket.cancelled += 1;
    } else {
      // Upcoming + Completed → “has visits”
      bucket.visits += 1;
    }
  }

  const weekStrip: DoctorWeekStripDay[] = [];
  for (let i = 0; i < 7; i += 1) {
    const dayDate = addCalendarDays(weekStart, i);
    const key = formatCalendarDate(dayDate);
    const counts = byDate.get(key)!;
    const hasStatusDots = counts.visits + counts.cancelled > 0;
    weekStrip.push({
      date: key,
      visits: counts.visits,
      pending: 0,
      cancelled: counts.cancelled,
      // Presence flag for the grey “free” legend when the day has no visit/cancelled dots.
      free: hasStatusDots ? 0 : 1,
    });
  }

  return {
    date: dateIso,
    metrics: {
      visitsToday: activeVisits.length,
      pendingCount: 0,
      freeSlotsToday: freeWindowsToday.length,
      cancellationsLast7Days: cancellationsLast7Days.length,
      pastVisitsThisMonth: pastVisitsMonth.length,
    },
    visits,
    nextVisit,
    pendingPatients: [],
    pastVisitsMonth,
    cancellationsLast7Days,
    freeWindowsToday,
    weekStrip,
  };
}
