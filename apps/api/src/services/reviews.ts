import { and, avg, count, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { patientProfiles } from "../db/schema/profiles.js";
import { reviews } from "../db/schema/reviews.js";
import { ApiError } from "../lib/errors.js";
import { newId } from "../lib/ids.js";
import { getAppointmentById } from "./appointments.js";

const PAST_STATUSES = ["Completed", "Cancelled", "Rescheduled"] as const;

export type ReviewDto = {
  id: string;
  appointmentId: string;
  doctorId: string;
  rating: number;
  text: string | null;
  createdAt: string;
};

export async function createReview(input: {
  patientId: string;
  appointmentId: string;
  rating: number;
  text?: string;
}): Promise<ReviewDto> {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { rating: "INVALID" });
  }

  const appointment = await getAppointmentById(input.appointmentId);
  if (appointment.patientId !== input.patientId) throw new ApiError("REVIEW_FORBIDDEN", 403);
  if (!PAST_STATUSES.includes(appointment.status as (typeof PAST_STATUSES)[number])) {
    throw new ApiError("REVIEW_FORBIDDEN", 403);
  }

  const [existing] = await getDb()
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.appointmentId, input.appointmentId))
    .limit(1);
  if (existing) throw new ApiError("REVIEW_ALREADY_EXISTS", 409);

  const id = newId("rev");
  try {
    await getDb().insert(reviews).values({
      id,
      appointmentId: input.appointmentId,
      patientId: input.patientId,
      doctorId: appointment.doctorId,
      rating: input.rating,
      text: input.text?.trim() ? input.text.trim() : null,
    });
  } catch (err) {
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
      throw new ApiError("REVIEW_ALREADY_EXISTS", 409);
    }
    throw err;
  }

  const [row] = await getDb().select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return {
    id: row!.id,
    appointmentId: row!.appointmentId,
    doctorId: row!.doctorId,
    rating: row!.rating,
    text: row!.text,
    createdAt: row!.createdAt.toISOString(),
  };
}

export async function getPatientReviews(patientId: string): Promise<{
  left: ReviewDto[];
  pending: Array<{ appointmentId: string; doctorId: string; startAt: string }>;
}> {
  const leftRows = await getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.patientId, patientId))
    .orderBy(desc(reviews.createdAt));

  const left: ReviewDto[] = leftRows.map((row) => ({
    id: row.id,
    appointmentId: row.appointmentId,
    doctorId: row.doctorId,
    rating: row.rating,
    text: row.text,
    createdAt: row.createdAt.toISOString(),
  }));

  const pastAppointments = await getDb()
    .select({
      id: appointments.id,
      doctorId: appointments.doctorId,
      startAt: appointments.startAt,
    })
    .from(appointments)
    .where(and(eq(appointments.patientId, patientId), inArray(appointments.status, [...PAST_STATUSES])));

  const reviewedIds = new Set(left.map((r) => r.appointmentId));
  const pending = pastAppointments
    .filter((a) => !reviewedIds.has(a.id))
    .map((a) => ({
      appointmentId: a.id,
      doctorId: a.doctorId,
      startAt: a.startAt.toISOString(),
    }));

  return { left, pending };
}

export async function getDoctorReviewStats(doctorId: string): Promise<{
  ratingAverage: number;
  reviewCount: number;
}> {
  const [agg] = await getDb()
    .select({
      average: avg(reviews.rating),
      count: count(),
    })
    .from(reviews)
    .where(eq(reviews.doctorId, doctorId));

  const reviewCount = Number(agg?.count ?? 0);
  const ratingAverage = reviewCount === 0 ? 0 : Number(Number(agg?.average ?? 0).toFixed(2));
  return { ratingAverage, reviewCount };
}

export async function getDoctorReviewStatsMap(
  doctorIds: string[],
): Promise<Map<string, { ratingAverage: number; reviewCount: number }>> {
  const map = new Map<string, { ratingAverage: number; reviewCount: number }>();
  if (doctorIds.length === 0) return map;

  const rows = await getDb()
    .select({
      doctorId: reviews.doctorId,
      average: avg(reviews.rating),
      count: count(),
    })
    .from(reviews)
    .where(inArray(reviews.doctorId, doctorIds))
    .groupBy(reviews.doctorId);

  for (const row of rows) {
    const reviewCount = Number(row.count);
    map.set(row.doctorId, {
      reviewCount,
      ratingAverage: reviewCount === 0 ? 0 : Number(Number(row.average ?? 0).toFixed(2)),
    });
  }
  return map;
}

export async function listDoctorReviews(doctorId: string, limit = 10): Promise<
  Array<{
    id: string;
    rating: number;
    text: string;
    patientDisplayName: string;
    createdAt: string;
  }>
> {
  const rows = await getDb()
    .select({
      id: reviews.id,
      rating: reviews.rating,
      text: reviews.text,
      createdAt: reviews.createdAt,
      firstName: patientProfiles.firstName,
      lastName: patientProfiles.lastName,
    })
    .from(reviews)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, reviews.patientId))
    .where(eq(reviews.doctorId, doctorId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    text: row.text ?? "",
    patientDisplayName: `${row.firstName} ${row.lastName.charAt(0)}.`,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getReviewForAppointment(appointmentId: string): Promise<ReviewDto | null> {
  const [row] = await getDb().select().from(reviews).where(eq(reviews.appointmentId, appointmentId)).limit(1);
  if (!row) return null;
  return {
    id: row.id,
    appointmentId: row.appointmentId,
    doctorId: row.doctorId,
    rating: row.rating,
    text: row.text,
    createdAt: row.createdAt.toISOString(),
  };
}
