/**
 * GET /api/v1/doctors/:doctorId — backend-spec.md SCR-03.
 */
import { and, count, eq } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorEducation } from "../db/schema/doctor-education.js";
import { doctorSchedules } from "../db/schema/doctor-schedule.js";
import { doctorProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import { formatCalendarDate, getZoneABounds } from "../lib/booking-horizon.js";
import { ApiError } from "../lib/errors.js";
import type { SessionUser } from "../plugins/session.js";
import { isFavourite } from "./patient-lists.js";
import { getDoctorReviewStats, listDoctorReviews } from "./reviews.js";

export type VisitFormatCard = "offline" | "online" | "both";

export type DoctorReviewDto = {
  id: string;
  rating: number;
  text: string;
  patientDisplayName: string;
  createdAt: string;
};

export type DoctorProfileDto = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicId: string;
  cityId: string;
  clinicName: string;
  cityName: string;
  address: string;
  photoUrl: string | null;
  yearsPractice: number;
  visitDurationMinutes: number;
  languages: Array<"uk" | "en">;
  /** Single `bio` column mirrored for FE dual-locale picker until dual fields exist. */
  descriptionUk: string;
  descriptionEn: string;
  bio: string;
  supportedFormats: VisitFormatCard;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  consultationCount: number;
  isFavourite: boolean;
  education: Array<{
    id: string;
    kind: "university" | "certificate" | "training";
    title: string;
    subtitle: string | null;
    yearFrom: number;
    yearTo: number | null;
    imageUrl: string | null;
  }>;
  reviews: DoctorReviewDto[];
};

function toCardFormats(formats: string[]): VisitFormatCard {
  const hasOffline = formats.includes("offline");
  const hasOnline = formats.includes("online");
  if (hasOffline && hasOnline) return "both";
  if (hasOnline) return "online";
  return "offline";
}

function normalizeLanguages(raw: string[] | null): Array<"uk" | "en"> {
  const allowed = new Set(["uk", "en"]);
  const picked = (raw ?? []).filter((lang): lang is "uk" | "en" => allowed.has(lang));
  if (picked.length === 0) return ["uk", "en"];
  return picked;
}

function effectivePromo(
  promoPriceUah: number | null,
  promoValidUntil: string | null,
  todayIso: string,
): number | null {
  if (promoPriceUah == null) return null;
  if (promoValidUntil != null && promoValidUntil < todayIso) return null;
  return promoPriceUah;
}

export async function getDoctorById(params: {
  doctorId: string;
  sessionUser?: SessionUser | null;
  now?: Date;
}): Promise<DoctorProfileDto> {
  const db = getDb();
  const now = params.now ?? new Date();
  const todayIso = formatCalendarDate(getZoneABounds(now).zoneAStartDate);

  const [row] = await db
    .select({
      id: doctorProfiles.userId,
      firstName: doctorProfiles.firstName,
      lastName: doctorProfiles.lastName,
      specialty: doctorProfiles.specialty,
      cityId: doctorProfiles.cityId,
      clinicId: doctorProfiles.clinicId,
      photoUrl: doctorProfiles.photoUrl,
      yearsPractice: doctorProfiles.yearsPractice,
      visitDurationMinutes: doctorProfiles.visitDurationMinutes,
      bio: doctorProfiles.bio,
      languages: doctorProfiles.languages,
      language: doctorProfiles.language,
      cityName: cities.name,
      clinicName: clinics.name,
      basePriceUah: doctorSchedules.basePriceUah,
      promoPriceUah: doctorSchedules.promoPriceUah,
      promoValidUntil: doctorSchedules.promoValidUntil,
      supportedFormats: doctorSchedules.supportedFormats,
      visibleInSearch: doctorSchedules.visibleInSearch,
    })
    .from(doctorProfiles)
    .innerJoin(doctorSchedules, eq(doctorSchedules.doctorUserId, doctorProfiles.userId))
    .innerJoin(cities, eq(cities.id, doctorProfiles.cityId))
    .innerJoin(clinics, eq(clinics.id, doctorProfiles.clinicId))
    .where(eq(doctorProfiles.userId, params.doctorId))
    .limit(1);

  if (!row || !row.visibleInSearch) {
    throw new ApiError("DOCTOR_NOT_FOUND", 404);
  }

  const [completed] = await db
    .select({ value: count() })
    .from(appointments)
    .where(and(eq(appointments.doctorId, params.doctorId), eq(appointments.status, "Completed")));

  const bio = (row.bio ?? "").trim();
  const descriptionUk = bio;
  const descriptionEn = bio;

  const stats = await getDoctorReviewStats(params.doctorId);
  const reviewList = await listDoctorReviews(params.doctorId);
  const educationRows = await db
    .select()
    .from(doctorEducation)
    .where(eq(doctorEducation.doctorUserId, params.doctorId));
  let favourite = false;
  if (params.sessionUser?.role === "patient") {
    favourite = await isFavourite(params.sessionUser.id, params.doctorId);
  }

  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    specialty: row.specialty,
    clinicId: row.clinicId,
    cityId: row.cityId,
    clinicName: row.clinicName,
    cityName: row.cityName,
    address: `${row.clinicName}, ${row.cityName}`,
    photoUrl: row.photoUrl,
    yearsPractice: row.yearsPractice,
    visitDurationMinutes: row.visitDurationMinutes,
    languages: normalizeLanguages(row.languages),
    descriptionUk,
    descriptionEn,
    bio,
    supportedFormats: toCardFormats(row.supportedFormats),
    basePrice: row.basePriceUah,
    promoPrice: effectivePromo(row.promoPriceUah, row.promoValidUntil, todayIso),
    ratingAverage: stats.ratingAverage,
    reviewCount: stats.reviewCount,
    consultationCount: Number(completed?.value ?? 0),
    isFavourite: favourite,
    education: educationRows.map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      subtitle: item.subtitle,
      yearFrom: item.yearFrom,
      yearTo: item.yearTo,
      imageUrl: item.imageUrl,
    })),
    reviews: reviewList,
  };
}
