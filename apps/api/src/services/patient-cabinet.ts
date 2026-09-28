import { and, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import { formatCalendarDate, getZoneABounds } from "../lib/booking-horizon.js";
import { getZonedDateParts } from "../lib/timezone.js";
import { listFavourites, listRecentlyViewed } from "./patient-lists.js";
import { getPatientReviews, getReviewForAppointment } from "./reviews.js";

const UPCOMING_STATUSES = ["Upcoming", "Reschedule Pending"] as const;
const PAST_STATUSES = ["Completed", "Cancelled", "Rescheduled"] as const;

export type CabinetAppointmentRow = {
  id: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  specialty: string;
  clinicName: string;
  cityName: string;
  startAt: string;
  durationMinutes: number;
  format: "offline" | "online";
  status: string;
  reason: string | null;
  cancelledBy: "patient" | "doctor" | null;
  proposedStartAt: string | null;
  canMove: boolean;
  canCancel: boolean;
  canReview: boolean;
  existingReview: { id: string; rating: number; text: string | null } | null;
  pendingDecisionUrl: string | null;
};

async function mapAppointmentRows(
  patientId: string,
  statuses: Array<"Upcoming" | "Reschedule Pending" | "Completed" | "Cancelled" | "Rescheduled">,
): Promise<CabinetAppointmentRow[]> {
  const rows = await getDb()
    .select({
      id: appointments.id,
      doctorId: appointments.doctorId,
      startAt: appointments.startAt,
      durationMinutes: appointments.durationMinutes,
      format: appointments.format,
      status: appointments.status,
      reason: appointments.reason,
      cancelledBy: appointments.cancelledBy,
      proposedStartAt: appointments.proposedStartAt,
      firstName: doctorProfiles.firstName,
      lastName: doctorProfiles.lastName,
      specialty: doctorProfiles.specialty,
      clinicName: clinics.name,
      cityName: cities.name,
    })
    .from(appointments)
    .innerJoin(doctorProfiles, eq(doctorProfiles.userId, appointments.doctorId))
    .innerJoin(cities, eq(cities.id, doctorProfiles.cityId))
    .innerJoin(clinics, eq(clinics.id, doctorProfiles.clinicId))
    .where(and(eq(appointments.patientId, patientId), inArray(appointments.status, statuses)))
    .orderBy(desc(appointments.startAt));

  const result: CabinetAppointmentRow[] = [];
  for (const row of rows) {
    const isPending = row.status === "Reschedule Pending";
    const isPast = PAST_STATUSES.includes(row.status as (typeof PAST_STATUSES)[number]);
    const existing = isPast ? await getReviewForAppointment(row.id) : null;
    result.push({
      id: row.id,
      doctorId: row.doctorId,
      doctorFirstName: row.firstName,
      doctorLastName: row.lastName,
      specialty: row.specialty,
      clinicName: row.clinicName,
      cityName: row.cityName,
      startAt: row.startAt.toISOString(),
      durationMinutes: row.durationMinutes,
      format: row.format,
      status: row.status,
      reason: row.reason,
      cancelledBy: row.cancelledBy,
      proposedStartAt: row.proposedStartAt?.toISOString() ?? null,
      canMove: row.status === "Upcoming",
      canCancel: row.status === "Upcoming" || isPending,
      canReview: isPast && !existing,
      existingReview: existing
        ? { id: existing.id, rating: existing.rating, text: existing.text }
        : null,
      pendingDecisionUrl: isPending ? `/appointments/${row.id}/pending-decision` : null,
    });
  }
  return result;
}

export async function listPatientAppointments(patientId: string): Promise<{
  upcoming: CabinetAppointmentRow[];
  past: CabinetAppointmentRow[];
}> {
  const [upcoming, past] = await Promise.all([
    mapAppointmentRows(patientId, [...UPCOMING_STATUSES]),
    mapAppointmentRows(patientId, [...PAST_STATUSES]),
  ]);
  // upcoming sorted ascending by start
  upcoming.sort((a, b) => a.startAt.localeCompare(b.startAt));
  return { upcoming, past };
}

export async function getPatientCabinet(patientId: string, now: Date = new Date()) {
  const { upcoming, past } = await listPatientAppointments(patientId);
  const pendingBanner = upcoming.find((a) => a.status === "Reschedule Pending") ?? null;
  const nextAppointment = upcoming.find((a) => a.status === "Upcoming") ?? upcoming[0] ?? null;

  const zone = getZoneABounds(now);
  const miniCalendarMap = new Map<string, number>();
  for (const row of upcoming) {
    const parts = getZonedDateParts(new Date(row.startAt));
    const key = formatCalendarDate({ year: parts.year, month: parts.month, day: parts.day });
    miniCalendarMap.set(key, (miniCalendarMap.get(key) ?? 0) + 1);
  }
  const miniCalendar = [...miniCalendarMap.entries()].map(([date, count]) => ({ date, count }));

  const [favourites, recentlyViewed, myReviewsDetail] = await Promise.all([
    listFavourites(patientId),
    listRecentlyViewed(patientId),
    getPatientReviews(patientId),
  ]);

  return {
    upcoming,
    past,
    pendingBanner,
    nextAppointment,
    miniCalendar,
    favourites: favourites.items,
    recentlyViewed: recentlyViewed.items,
    myReviews: {
      leftCount: myReviewsDetail.left.length,
      pendingCount: myReviewsDetail.pending.length,
    },
    metrics: {
      upcomingCount: upcoming.length,
      pastCount: past.length,
    },
    zoneA: {
      start: formatCalendarDate(zone.zoneAStartDate),
      end: formatCalendarDate(zone.zoneAEndDate),
    },
  };
}
