import { afterEach, describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { getDoctorById } from "./doctors-profile.js";

const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);

describe("getDoctorById", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("throws DOCTOR_NOT_FOUND for unknown id", async () => {
    await expect(getDoctorById({ doctorId: "no-such", now: NOW })).rejects.toMatchObject({
      code: "DOCTOR_NOT_FOUND",
    });
  });

  it("returns public profile fields from DB", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      firstName: "Profile",
      lastName: "Doc",
      specialty: "neurologist",
      supportedFormats: ["offline", "online"],
      basePriceUah: 700,
      promoPriceUah: 500,
    });
    createdUserIds.push(doctorId);

    const profile = await getDoctorById({ doctorId, now: NOW });

    expect(profile.id).toBe(doctorId);
    expect(profile.firstName).toBe("Profile");
    expect(profile.specialty).toBe("neurologist");
    expect(profile.supportedFormats).toBe("both");
    expect(profile.basePrice).toBe(700);
    expect(profile.promoPrice).toBe(500);
    expect(profile.clinicName).toBe("Test Clinic");
    expect(profile.cityName).toBe("Test City");
    expect(profile.address).toContain("Test Clinic");
    expect(profile.reviews).toEqual([]);
    expect(profile.education).toEqual([]);
    expect(profile.isFavourite).toBe(false);
    expect(profile.consultationCount).toBe(0);
  });

  it("hides doctors with visibleInSearch=false", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      visibleInSearch: false,
    });
    createdUserIds.push(doctorId);

    await expect(getDoctorById({ doctorId, now: NOW })).rejects.toMatchObject({
      code: "DOCTOR_NOT_FOUND",
    });
  });
});
