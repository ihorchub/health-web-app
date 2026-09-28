/**
 * GET /api/v1/doctors/search — backend-spec.md SCR-02.
 *
 * Filters in SQL, then computes nearestFreeAt via the same slot engine as calendar.
 */
import { and, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";

import { isSpecialtyId, specialtyIdsMatchingQuery } from "../constants/specialties.js";
import { getDb } from "../db/client.js";
import { doctorSchedules } from "../db/schema/doctor-schedule.js";
import { doctorProfiles, patientProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import {
  addCalendarDays,
  compareCalendarDates,
  formatCalendarDate,
  getZoneABounds,
  parseCalendarDate,
  weekdayKeyForDate,
  type CalendarDate,
} from "../lib/booking-horizon.js";
import { ApiError } from "../lib/errors.js";
import type { SessionUser } from "../plugins/session.js";
import { dayBoundsUtc, loadDoctorForBooking, loadOccupancyInRange } from "./booking-validation.js";
import { favouriteDoctorIds } from "./patient-lists.js";
import { getDoctorReviewStatsMap } from "./reviews.js";
import { generateDaySlots } from "./slots.js";

export type VisitFormatCard = "offline" | "online" | "both";
export type SearchSort = "rating" | "nearest_slot";

export type DoctorsSearchParams = {
  q?: string;
  cityId?: string;
  clinicId?: string;
  specialty?: string;
  format?: "offline" | "online" | "both";
  date?: string;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: SearchSort;
  cursor?: string;
  limit?: number;
  sessionUser?: SessionUser | null;
  now?: Date;
};

export type DoctorSearchCard = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  cityName: string;
  clinicId: string;
  cityId: string;
  photoUrl: string | null;
  supportedFormats: VisitFormatCard;
  nearestFreeAt: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  isFavourite: boolean;
};

export type DoctorsSearchResult = {
  total: number;
  nextCursor: string | null;
  items: DoctorSearchCard[];
  prefill?: { cityId: string | null; clinicId: string | null };
};

type DoctorSearchRow = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  cityId: string;
  clinicId: string;
  photoUrl: string | null;
  cityName: string;
  clinicName: string;
  basePriceUah: number;
  promoPriceUah: number | null;
  promoValidUntil: string | null;
  supportedFormats: string[];
};

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;
const MAX_ZONE_A_DAYS = 62;

function toCardFormats(formats: string[]): VisitFormatCard {
  const hasOffline = formats.includes("offline");
  const hasOnline = formats.includes("online");
  if (hasOffline && hasOnline) return "both";
  if (hasOnline) return "online";
  return "offline";
}

function effectivePrice(row: DoctorSearchRow, todayIso: string): number {
  if (
    row.promoPriceUah != null &&
    (row.promoValidUntil == null || row.promoValidUntil >= todayIso)
  ) {
    return row.promoPriceUah;
  }
  return row.basePriceUah;
}

function effectivePromo(row: DoctorSearchRow, todayIso: string): number | null {
  if (
    row.promoPriceUah != null &&
    (row.promoValidUntil == null || row.promoValidUntil >= todayIso)
  ) {
    return row.promoPriceUah;
  }
  return null;
}

function supportsFormat(formats: string[], format?: "offline" | "online" | "both"): boolean {
  if (!format) return true;
  if (format === "both") return formats.includes("offline") && formats.includes("online");
  return formats.includes(format);
}

async function findNearestFreeAt(params: {
  doctorId: string;
  now: Date;
  dateFilter?: CalendarDate;
}): Promise<string | null> {
  let doctor;
  try {
    doctor = await loadDoctorForBooking(params.doctorId);
  } catch (err) {
    // Parallel test cleanup (or deleted doctor mid-scan) — skip quietly.
    if (err instanceof ApiError && err.code === "DOCTOR_NOT_FOUND") return null;
    throw err;
  }
  const zoneBounds = getZoneABounds(params.now);

  let start = zoneBounds.zoneAStartDate;
  let end = zoneBounds.zoneAEndDate;
  if (params.dateFilter) {
    if (
      compareCalendarDates(params.dateFilter, zoneBounds.zoneAStartDate) < 0 ||
      compareCalendarDates(params.dateFilter, zoneBounds.zoneAEndDate) > 0
    ) {
      return null;
    }
    start = params.dateFilter;
    end = params.dateFilter;
  }

  const { startUtc: rangeStartUtc } = dayBoundsUtc(start);
  const { startUtc: rangeEndExclusiveUtc } = dayBoundsUtc(addCalendarDays(end, 1));
  const occupancy = await loadOccupancyInRange(params.doctorId, rangeStartUtc, rangeEndExclusiveUtc);

  let cursor = start;
  for (let i = 0; i < MAX_ZONE_A_DAYS && compareCalendarDates(cursor, end) <= 0; i += 1) {
    if (doctor.vacationDates.includes(formatCalendarDate(cursor))) {
      cursor = addCalendarDays(cursor, 1);
      continue;
    }
    const bounds = dayBoundsUtc(cursor);
    const dayOccupancy = occupancy.filter(
      (entry) =>
        entry.startAt.getTime() >= bounds.startUtc.getTime() &&
        entry.startAt.getTime() < bounds.endExclusiveUtc.getTime(),
    );
    const template = doctor.weeklyTemplate[weekdayKeyForDate(cursor)];
    const slots = generateDaySlots({
      dateLocal: cursor,
      template,
      visitDurationMinutes: doctor.visitDurationMinutes,
      occupied: dayOccupancy,
      now: params.now,
      zoneBounds,
    });
    const free = slots.find((slot) => slot.status === "free");
    if (free) return free.startAt;
    cursor = addCalendarDays(cursor, 1);
  }
  return null;
}

function buildTextFilter(q: string): SQL | undefined {
  const needle = `%${q.trim()}%`;
  if (!q.trim()) return undefined;

  const specialtyIds = specialtyIdsMatchingQuery(q);

  const parts: SQL[] = [
    ilike(doctorProfiles.firstName, needle),
    ilike(doctorProfiles.lastName, needle),
    ilike(sql`(${doctorProfiles.firstName} || ' ' || ${doctorProfiles.lastName})`, needle),
    ilike(clinics.name, needle),
    ilike(cities.name, needle),
  ];
  if (specialtyIds.length > 0) {
    parts.push(inArray(doctorProfiles.specialty, specialtyIds));
  }
  // Also match specialty enum id substring (e.g. "cardio")
  parts.push(sql`${doctorProfiles.specialty}::text ILIKE ${needle}`);

  return or(...parts);
}

export async function searchDoctors(params: DoctorsSearchParams): Promise<DoctorsSearchResult> {
  try {
    return await searchDoctorsInner(params);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("SEARCH_FAILED", 500, undefined, err instanceof Error ? err.message : undefined);
  }
}

async function searchDoctorsInner(params: DoctorsSearchParams): Promise<DoctorsSearchResult> {
  const now = params.now ?? new Date();
  const todayIso = formatCalendarDate(getZoneABounds(now).zoneAStartDate);
  const limit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = params.cursor ? Math.max(0, Number.parseInt(params.cursor, 10) || 0) : 0;
  const sort: SearchSort = params.sort ?? "nearest_slot";

  let dateFilter: CalendarDate | undefined;
  if (params.date) {
    try {
      dateFilter = parseCalendarDate(params.date);
    } catch {
      throw new ApiError("AUTH_VALIDATION_FAILED", 400, { date: "INVALID" });
    }
  }

  const db = getDb();
  const conditions: SQL[] = [eq(doctorSchedules.visibleInSearch, true)];

  if (params.cityId) conditions.push(eq(doctorProfiles.cityId, params.cityId));
  if (params.clinicId) conditions.push(eq(doctorProfiles.clinicId, params.clinicId));
  if (params.specialty) {
    if (!isSpecialtyId(params.specialty)) {
      throw new ApiError("AUTH_VALIDATION_FAILED", 400, { specialty: "INVALID" });
    }
    conditions.push(eq(doctorProfiles.specialty, params.specialty));
  }
  if (params.format === "both") {
    conditions.push(sql`${doctorSchedules.supportedFormats} @> ARRAY['offline','online']::text[]`);
  } else if (params.format) {
    conditions.push(sql`${doctorSchedules.supportedFormats} @> ARRAY[${params.format}]::text[]`);
  }

  const textFilter = params.q ? buildTextFilter(params.q) : undefined;
  if (textFilter) conditions.push(textFilter);

  const rows = await db
    .select({
      id: doctorProfiles.userId,
      firstName: doctorProfiles.firstName,
      lastName: doctorProfiles.lastName,
      specialty: doctorProfiles.specialty,
      cityId: doctorProfiles.cityId,
      clinicId: doctorProfiles.clinicId,
      photoUrl: doctorProfiles.photoUrl,
      cityName: cities.name,
      clinicName: clinics.name,
      basePriceUah: doctorSchedules.basePriceUah,
      promoPriceUah: doctorSchedules.promoPriceUah,
      promoValidUntil: doctorSchedules.promoValidUntil,
      supportedFormats: doctorSchedules.supportedFormats,
    })
    .from(doctorProfiles)
    .innerJoin(doctorSchedules, eq(doctorSchedules.doctorUserId, doctorProfiles.userId))
    .innerJoin(cities, eq(cities.id, doctorProfiles.cityId))
    .innerJoin(clinics, eq(clinics.id, doctorProfiles.clinicId))
    .where(and(...conditions));

  const ratingMap = await getDoctorReviewStatsMap(rows.map((r) => r.id));

  // Price / rating filters after join (promo-aware price is computed).
  const filtered = rows.filter((row) => {
    if (!supportsFormat(row.supportedFormats, params.format)) return false;
    const price = effectivePrice(row, todayIso);
    if (params.priceMin != null && price < params.priceMin) return false;
    if (params.priceMax != null && price > params.priceMax) return false;
    const ratingAverage = ratingMap.get(row.id)?.ratingAverage ?? 0;
    if (params.minRating != null && ratingAverage < params.minRating) return false;
    return true;
  });

  let homeClinicId: string | null = null;
  let prefill: DoctorsSearchResult["prefill"];
  let favSet = new Set<string>();
  if (params.sessionUser?.role === "patient") {
    const [patient] = await db
      .select({
        homeCityId: patientProfiles.homeCityId,
        homeClinicId: patientProfiles.homeClinicId,
      })
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, params.sessionUser.id))
      .limit(1);
    homeClinicId = patient?.homeClinicId ?? null;
    prefill = {
      cityId: patient?.homeCityId ?? null,
      clinicId: patient?.homeClinicId ?? null,
    };
    favSet = await favouriteDoctorIds(
      params.sessionUser.id,
      filtered.map((r) => r.id),
    );
  }

  const withSlots: DoctorSearchCard[] = [];
  for (const row of filtered) {
    const nearestFreeAt = await findNearestFreeAt({
      doctorId: row.id,
      now,
      dateFilter,
    });
    // Date filter: must have a free slot that day.
    if (dateFilter && !nearestFreeAt) continue;

    const stats = ratingMap.get(row.id) ?? { ratingAverage: 0, reviewCount: 0 };
    withSlots.push({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      specialty: row.specialty,
      clinicName: row.clinicName,
      cityName: row.cityName,
      clinicId: row.clinicId,
      cityId: row.cityId,
      photoUrl: row.photoUrl,
      supportedFormats: toCardFormats(row.supportedFormats),
      nearestFreeAt,
      basePrice: row.basePriceUah,
      promoPrice: effectivePromo(row, todayIso),
      ratingAverage: stats.ratingAverage,
      reviewCount: stats.reviewCount,
      isFavourite: favSet.has(row.id),
    });
  }

  withSlots.sort((a, b) => {
    if (homeClinicId) {
      const aHome = a.clinicId === homeClinicId ? 0 : 1;
      const bHome = b.clinicId === homeClinicId ? 0 : 1;
      if (aHome !== bHome) return aHome - bHome;
    }

    if (sort === "rating") {
      if (b.ratingAverage !== a.ratingAverage) return b.ratingAverage - a.ratingAverage;
      if (!a.nearestFreeAt && !b.nearestFreeAt) return 0;
      if (!a.nearestFreeAt) return 1;
      if (!b.nearestFreeAt) return -1;
      return a.nearestFreeAt.localeCompare(b.nearestFreeAt);
    }

    // nearest_slot (default)
    if (!a.nearestFreeAt && !b.nearestFreeAt) return 0;
    if (!a.nearestFreeAt) return 1;
    if (!b.nearestFreeAt) return -1;
    return a.nearestFreeAt.localeCompare(b.nearestFreeAt);
  });

  const total = withSlots.length;
  const page = withSlots.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const nextCursor = nextOffset < total ? String(nextOffset) : null;

  return {
    total,
    nextCursor,
    items: page,
    ...(prefill ? { prefill } : {}),
  };
}
