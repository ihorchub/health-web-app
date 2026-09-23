/**
 * Lightweight DB fixtures for integration tests. Every created row uses a `test_` id prefix
 * so it never collides with seed/demo data, and `cleanupTestData` removes everything created
 * for a given test (appointments first, to satisfy FK constraints, then profiles/users).
 */
import { eq, inArray } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorSchedules } from "../db/schema/doctor-schedule.js";
import type { WeeklyTemplate } from "../db/schema/doctor-schedule.js";
import { doctorProfiles, patientProfiles } from "../db/schema/profiles.js";
import { users } from "../db/schema/users.js";
import { newId } from "../lib/ids.js";

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
};

export async function createTestDoctor(options: TestDoctorOptions = {}): Promise<string> {
  const db = getDb();
  const userId = newId("test_doctor");
  const visitDurationMinutes = options.visitDurationMinutes ?? 30;

  await db.insert(users).values({
    id: userId,
    email: `${userId}@test.medicly.local`,
    passwordHash: "not-a-real-hash",
    role: "doctor",
  });
  await db.insert(doctorProfiles).values({
    userId,
    firstName: "Test",
    lastName: "Doctor",
    dob: "1980-01-01",
    cityId: "test-city",
    clinicId: "test-clinic",
    specialty: "family_doctor",
    yearsPractice: 5,
    visitDurationMinutes,
  });
  await db.insert(doctorSchedules).values({
    doctorUserId: userId,
    basePriceUah: 600,
    supportedFormats: options.supportedFormats ?? ["offline"],
    weeklyTemplate: options.weeklyTemplate ?? ALL_DAYS_OFF,
    visibleInSearch: true,
  });
  return userId;
}

export async function cleanupTestData(userIds: string[]): Promise<void> {
  if (userIds.length === 0) return;
  const db = getDb();
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
