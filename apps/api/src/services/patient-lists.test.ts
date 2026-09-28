import { afterEach, describe, expect, it } from "vitest";

import { ApiError } from "../lib/errors.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import {
  addFavourite,
  clearRecentlyViewed,
  listFavourites,
  listRecentlyViewed,
  recordRecentlyViewed,
  removeFavourite,
} from "./patient-lists.js";
import { getDoctorById } from "./doctors-profile.js";

describe("patient-lists", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("adds and removes favourites and flips isFavourite on profile", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    expect(
      (
        await getDoctorById({
          doctorId,
          sessionUser: { id: patientId, role: "patient", email: "x@test.local" },
        })
      ).isFavourite,
    ).toBe(false);

    await addFavourite(patientId, doctorId);
    expect((await listFavourites(patientId)).items.map((d) => d.id)).toEqual([doctorId]);
    expect(
      (
        await getDoctorById({
          doctorId,
          sessionUser: { id: patientId, role: "patient", email: "x@test.local" },
        })
      ).isFavourite,
    ).toBe(true);

    await removeFavourite(patientId, doctorId);
    expect((await listFavourites(patientId)).items).toHaveLength(0);
  });

  it("keeps only last 10 recently viewed and clears all", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);

    const doctorIds: string[] = [];
    for (let i = 0; i < 12; i += 1) {
      const id = await createTestDoctor({
        weeklyTemplate: workingWeeklyTemplate(),
        firstName: `D${i}`,
      });
      doctorIds.push(id);
      createdUserIds.push(id);
      await recordRecentlyViewed(patientId, id);
    }

    const listed = await listRecentlyViewed(patientId);
    expect(listed.items).toHaveLength(10);
    expect(listed.items[0]?.id).toBe(doctorIds[11]);

    await clearRecentlyViewed(patientId);
    expect((await listRecentlyViewed(patientId)).items).toHaveLength(0);
  });

  it("rejects favourite for unknown doctor", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);
    await expect(addFavourite(patientId, "doc_missing")).rejects.toMatchObject({
      code: "DOCTOR_NOT_FOUND",
    } satisfies Partial<ApiError>);
  });
});
