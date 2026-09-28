/**
 * Lightweight DB fixtures for integration tests. Every created row uses a `test_` id prefix
 * so it never collides with seed/demo data, and `cleanupTestData` removes everything created
 * for a given test (child rows first, to satisfy FK constraints, then profiles/users).
 */
import { eq, inArray } from "drizzle-orm";

import type { SpecialtyId } from "../constants/specialties.js";
import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorEducation } from "../db/schema/doctor-education.js";
import { doctorSchedules } from "../db/schema/doctor-schedule.js";
import type { WeeklyTemplate } from "../db/schema/doctor-schedule.js";
import { notifications } from "../db/schema/notifications.js";
import { patientFavourites, patientRecentlyViewed } from "../db/schema/patient-lists.js";
import { doctorProfiles, patientProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import { reviews } from "../db/schema/reviews.js";
import { users } from "../db/schema/users.js";
import { newId } from "../lib/ids.js";

const TEST_CITY_ID = "test-city";
const TEST_CLINIC_ID = "test-clinic";

/** Ensure reference rows exist for test city/clinic (search joins cities/clinics). */
export async function ensureTestReference(): Promise<void> {
  const db = getDb();
  await db.insert(cities).values({ id: TEST_CITY_ID, name: "Test City" }).onConflictDoNothing();
  await db
    .insert(clinics)
    .values({ id: TEST_CLINIC_ID, cityId: TEST_CITY_ID, name: "Test Clinic" })
    .onConflictDoNothing();
}

const ALL_DAYS_OFF: WeeklyTemplate = {
  monday: { works: false },
  tuesday: { works: false },
  wednesday: { works: false },
  thursday: { works: false },
  friday: { works: false },
  saturday: { works: false },
  sunday: { works: false },
};

export async function createTestPatient(): Promise<string> {
  const db = getDb();
  const userId = newId("test_patient");
  await db.insert(users).values({
    id: userId,
    email: `${userId}@test.medicly.local`,
    passwordHash: "not-a-real-hash",
    role: "patient",
  });
  await db.insert(patientProfiles).values({
    userId,
    firstName: "Test",
    lastName: "Patient",
    dob: "1990-01-01",
    gender: "female",
    homeCityId: "test-city",
    homeClinicId: "test-clinic",
  });
  return userId;
}

export type TestDoctorOptions = {
  weeklyTemplate?: WeeklyTemplate;
  visitDurationMinutes?: number;
  supportedFormats?: Array<"offline" | "online">;
  firstName?: string;
  lastName?: string;
  specialty?: SpecialtyId;
  cityId?: string;
  clinicId?: string;
  cityName?: string;
  clinicName?: string;
  basePriceUah?: number;
  promoPriceUah?: number | null;
  visibleInSearch?: boolean;
  vacationDates?: string[];
};

export async function createTestDoctor(options: TestDoctorOptions = {}): Promise<string> {
  const db = getDb();
  const userId = newId("test_doctor");
  const visitDurationMinutes = options.visitDurationMinutes ?? 30;
  const cityId = options.cityId ?? TEST_CITY_ID;
  const clinicId = options.clinicId ?? TEST_CLINIC_ID;

  await db
    .insert(cities)
    .values({ id: cityId, name: options.cityName ?? "Test City" })
    .onConflictDoNothing();
  await db
    .insert(clinics)
    .values({ id: clinicId, cityId, name: options.clinicName ?? "Test Clinic" })
    .onConflictDoNothing();

  await db.insert(users).values({
    id: userId,
    email: `${userId}@test.medicly.local`,
    passwordHash: "not-a-real-hash",
    role: "doctor",
  });
  await db.insert(doctorProfiles).values({
    userId,
    firstName: options.firstName ?? "Test",
    lastName: options.lastName ?? "Doctor",
    dob: "1980-01-01",
    cityId,
    clinicId,
    specialty: options.specialty ?? "family_doctor",
    yearsPractice: 5,
    visitDurationMinutes,
  });
  await db.insert(doctorSchedules).values({
    doctorUserId: userId,
    basePriceUah: options.basePriceUah ?? 600,
    promoPriceUah: options.promoPriceUah ?? null,
    supportedFormats: options.supportedFormats ?? ["offline"],
    weeklyTemplate: options.weeklyTemplate ?? ALL_DAYS_OFF,
    vacationDates: options.vacationDates ?? [],
    visibleInSearch: options.visibleInSearch ?? true,
  });
  return userId;
}

export async function cleanupTestData(userIds: string[]): Promise<void> {
  if (userIds.length === 0) return;
  const db = getDb();
  await db.delete(reviews).where(inArray(reviews.patientId, userIds));
  await db.delete(reviews).where(inArray(reviews.doctorId, userIds));
  await db.delete(patientFavourites).where(inArray(patientFavourites.patientId, userIds));
  await db.delete(patientFavourites).where(inArray(patientFavourites.doctorId, userIds));
  await db.delete(patientRecentlyViewed).where(inArray(patientRecentlyViewed.patientId, userIds));
  await db.delete(patientRecentlyViewed).where(inArray(patientRecentlyViewed.doctorId, userIds));
  await db.delete(notifications).where(inArray(notifications.userId, userIds));
  await db.delete(doctorEducation).where(inArray(doctorEducation.doctorUserId, userIds));
  await db.delete(appointments).where(inArray(appointments.doctorId, userIds));
  await db.delete(appointments).where(inArray(appointments.patientId, userIds));
  await db.delete(doctorSchedules).where(inArray(doctorSchedules.doctorUserId, userIds));
  await db.delete(doctorProfiles).where(inArray(doctorProfiles.userId, userIds));
  await db.delete(patientProfiles).where(inArray(patientProfiles.userId, userIds));
  await db.delete(users).where(inArray(users.id, userIds));
}

export function workingWeeklyTemplate(): WeeklyTemplate {
  return {
    monday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
    tuesday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
    wednesday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
    thursday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
    friday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
    saturday: { works: false },
    sunday: { works: false },
  };
}

// re-exported for convenience in tests that need direct row lookups
export { eq };
