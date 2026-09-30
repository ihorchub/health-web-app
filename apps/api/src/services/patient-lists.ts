import { and, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { doctorSchedules } from "../db/schema/doctor-schedule.js";
import { patientFavourites, patientRecentlyViewed } from "../db/schema/patient-lists.js";
import { doctorProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import { ApiError } from "../lib/errors.js";
import { getDoctorReviewStatsMap } from "./reviews.js";

const RECENTLY_VIEWED_LIMIT = 10;

export type DoctorListCard = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  clinicName: string;
  cityName: string;
  photoUrl: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
};

async function assertDoctorExists(doctorId: string): Promise<void> {
  const [row] = await getDb()
    .select({ id: doctorProfiles.userId })
    .from(doctorProfiles)
    .innerJoin(doctorSchedules, eq(doctorSchedules.doctorUserId, doctorProfiles.userId))
    .where(and(eq(doctorProfiles.userId, doctorId), eq(doctorSchedules.visibleInSearch, true)))
    .limit(1);
  if (!row) throw new ApiError("DOCTOR_NOT_FOUND", 404);
}

async function loadDoctorCards(doctorIds: string[]): Promise<DoctorListCard[]> {
  if (doctorIds.length === 0) return [];
  const rows = await getDb()
    .select({
      id: doctorProfiles.userId,
      firstName: doctorProfiles.firstName,
      lastName: doctorProfiles.lastName,
      specialty: doctorProfiles.specialty,
      photoUrl: doctorProfiles.photoUrl,
      clinicName: clinics.name,
      cityName: cities.name,
      basePrice: doctorSchedules.basePriceUah,
      promoPrice: doctorSchedules.promoPriceUah,
    })
    .from(doctorProfiles)
    .innerJoin(doctorSchedules, eq(doctorSchedules.doctorUserId, doctorProfiles.userId))
    .innerJoin(cities, eq(cities.id, doctorProfiles.cityId))
    .innerJoin(clinics, eq(clinics.id, doctorProfiles.clinicId))
    .where(inArray(doctorProfiles.userId, doctorIds));

  const byId = new Map(rows.map((r) => [r.id, r]));
  const ratingMap = await getDoctorReviewStatsMap(doctorIds);
  return doctorIds
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({
      ...r,
      ratingAverage: ratingMap.get(r.id)?.ratingAverage ?? 0,
    }));
}

export async function addFavourite(patientId: string, doctorId: string): Promise<{ ok: true; isFavourite: true }> {
  await assertDoctorExists(doctorId);
  await getDb()
    .insert(patientFavourites)
    .values({ patientId, doctorId })
    .onConflictDoNothing();
  return { ok: true, isFavourite: true };
}

export async function removeFavourite(
  patientId: string,
  doctorId: string,
): Promise<{ ok: true; isFavourite: false }> {
  await getDb()
    .delete(patientFavourites)
    .where(and(eq(patientFavourites.patientId, patientId), eq(patientFavourites.doctorId, doctorId)));
  return { ok: true, isFavourite: false };
}

export async function listFavourites(patientId: string): Promise<{ items: DoctorListCard[] }> {
  const rows = await getDb()
    .select({ doctorId: patientFavourites.doctorId })
    .from(patientFavourites)
    .where(eq(patientFavourites.patientId, patientId))
    .orderBy(desc(patientFavourites.createdAt));
  const items = await loadDoctorCards(rows.map((r) => r.doctorId));
  return { items };
}

export async function isFavourite(patientId: string, doctorId: string): Promise<boolean> {
  const [row] = await getDb()
    .select({ doctorId: patientFavourites.doctorId })
    .from(patientFavourites)
    .where(and(eq(patientFavourites.patientId, patientId), eq(patientFavourites.doctorId, doctorId)))
    .limit(1);
  return Boolean(row);
}

export async function recordRecentlyViewed(patientId: string, doctorId: string): Promise<{ ok: true }> {
  await assertDoctorExists(doctorId);
  const db = getDb();
  await db
    .insert(patientRecentlyViewed)
    .values({ patientId, doctorId, viewedAt: new Date() })
    .onConflictDoUpdate({
      target: [patientRecentlyViewed.patientId, patientRecentlyViewed.doctorId],
      set: { viewedAt: new Date() },
    });

  const all = await db
    .select({ doctorId: patientRecentlyViewed.doctorId })
    .from(patientRecentlyViewed)
    .where(eq(patientRecentlyViewed.patientId, patientId))
    .orderBy(desc(patientRecentlyViewed.viewedAt));

  if (all.length > RECENTLY_VIEWED_LIMIT) {
    const dropIds = all.slice(RECENTLY_VIEWED_LIMIT).map((r) => r.doctorId);
    await db
      .delete(patientRecentlyViewed)
      .where(
        and(
          eq(patientRecentlyViewed.patientId, patientId),
          inArray(patientRecentlyViewed.doctorId, dropIds),
        ),
      );
  }

  return { ok: true };
}

export async function listRecentlyViewed(patientId: string): Promise<{ items: DoctorListCard[] }> {
  const rows = await getDb()
    .select({ doctorId: patientRecentlyViewed.doctorId })
    .from(patientRecentlyViewed)
    .where(eq(patientRecentlyViewed.patientId, patientId))
    .orderBy(desc(patientRecentlyViewed.viewedAt))
    .limit(RECENTLY_VIEWED_LIMIT);
  const items = await loadDoctorCards(rows.map((r) => r.doctorId));
  return { items };
}

export async function clearRecentlyViewed(patientId: string): Promise<{ ok: true }> {
  await getDb().delete(patientRecentlyViewed).where(eq(patientRecentlyViewed.patientId, patientId));
  return { ok: true };
}

export async function favouriteDoctorIds(patientId: string, doctorIds: string[]): Promise<Set<string>> {
  if (doctorIds.length === 0) return new Set();
  const rows = await getDb()
    .select({ doctorId: patientFavourites.doctorId })
    .from(patientFavourites)
    .where(
      and(eq(patientFavourites.patientId, patientId), inArray(patientFavourites.doctorId, doctorIds)),
    );
  return new Set(rows.map((r) => r.doctorId));
}
