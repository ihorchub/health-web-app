import { afterEach, describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { searchDoctors } from "./doctors-search.js";

const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0); // Monday 10 Aug 2026, 08:00 Kyiv

describe("searchDoctors", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("returns visible doctors with nearestFreeAt in Zone A", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      firstName: "Olena",
      lastName: "Koval",
      specialty: "cardiologist",
    });
    createdUserIds.push(doctorId);

    const result = await searchDoctors({ now: NOW });

    const card = result.items.find((item) => item.id === doctorId);
    expect(card).toBeDefined();
    expect(card?.firstName).toBe("Olena");
    expect(card?.specialty).toBe("cardiologist");
    expect(card?.clinicName).toBe("Test Clinic");
    expect(card?.nearestFreeAt).toBeTruthy();
    expect(card?.ratingAverage).toBe(0);
    expect(card?.isFavourite).toBe(false);
    expect(card?.supportedFormats).toBe("offline");
  });

  it("filters by specialty and format", async () => {
    const cardio = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      specialty: "cardiologist",
      supportedFormats: ["offline"],
    });
    const dermaOnline = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      specialty: "dermatologist",
      supportedFormats: ["online", "offline"],
    });
    createdUserIds.push(cardio, dermaOnline);

    const bySpecialty = await searchDoctors({ specialty: "cardiologist", now: NOW });
    expect(bySpecialty.items.every((d) => d.specialty === "cardiologist")).toBe(true);
    expect(bySpecialty.items.some((d) => d.id === cardio)).toBe(true);
    expect(bySpecialty.items.some((d) => d.id === dermaOnline)).toBe(false);

    const byFormat = await searchDoctors({ format: "online", now: NOW });
    expect(byFormat.items.some((d) => d.id === dermaOnline)).toBe(true);
    expect(byFormat.items.some((d) => d.id === cardio)).toBe(false);
  });

  it("matches q against doctor name", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      firstName: "UniqueSearch",
      lastName: "Marker",
    });
    createdUserIds.push(doctorId);

    const hit = await searchDoctors({ q: "UniqueSearch", now: NOW });
    expect(hit.items.some((d) => d.id === doctorId)).toBe(true);

    const miss = await searchDoctors({ q: "NoSuchDoctorXYZ", now: NOW });
    expect(miss.items.some((d) => d.id === doctorId)).toBe(false);
  });

  it("hides doctors with visibleInSearch=false", async () => {
    const hidden = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      visibleInSearch: false,
      firstName: "Hidden",
    });
    createdUserIds.push(hidden);

    const result = await searchDoctors({ q: "Hidden", now: NOW });
    expect(result.items.some((d) => d.id === hidden)).toBe(false);
  });

  it("paginates with cursor", async () => {
    const a = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      firstName: "PageA",
      lastName: "Doc",
    });
    const b = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      firstName: "PageB",
      lastName: "Doc",
    });
    createdUserIds.push(a, b);

    const page1 = await searchDoctors({ q: "Page", limit: 1, now: NOW });
    expect(page1.items).toHaveLength(1);
    expect(page1.total).toBeGreaterThanOrEqual(2);
    expect(page1.nextCursor).toBe("1");

    const page2 = await searchDoctors({ q: "Page", limit: 1, cursor: "1", now: NOW });
    expect(page2.items).toHaveLength(1);
    expect(page2.items[0]?.id).not.toBe(page1.items[0]?.id);
  });

  it("returns prefill for logged-in patient and ranks home clinic first", async () => {
    const homeClinicDoctor = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      clinicId: "test-clinic",
      cityId: "test-city",
      firstName: "HomeClinic",
    });
    const otherDoctor = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      cityId: "test-city-other",
      clinicId: "test-clinic-other",
      cityName: "Other City",
      clinicName: "Other Clinic",
      firstName: "OtherClinic",
    });
    const patientId = await createTestPatient();
    createdUserIds.push(homeClinicDoctor, otherDoctor, patientId);

    const result = await searchDoctors({
      now: NOW,
      sessionUser: {
        id: patientId,
        email: "p@test.local",
        role: "patient",
      },
    });

    expect(result.prefill).toEqual({ cityId: "test-city", clinicId: "test-clinic" });

    const ids = result.items.map((d) => d.id);
    const homeIdx = ids.indexOf(homeClinicDoctor);
    const otherIdx = ids.indexOf(otherDoctor);
    expect(homeIdx).toBeGreaterThanOrEqual(0);
    expect(otherIdx).toBeGreaterThanOrEqual(0);
    expect(homeIdx).toBeLessThan(otherIdx);
  });

  it("filters by date when that day has no free slots", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
    });
    createdUserIds.push(doctorId);

    // Sunday 16 Aug 2026 is day_off under workingWeeklyTemplate
    const empty = await searchDoctors({ date: "2026-08-16", now: NOW });
    expect(empty.items.some((d) => d.id === doctorId)).toBe(false);

    const monday = await searchDoctors({ date: "2026-08-10", now: NOW });
    expect(monday.items.some((d) => d.id === doctorId)).toBe(true);
  });
});
