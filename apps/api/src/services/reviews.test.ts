import { afterEach, describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { bookAppointment, markCompleted } from "./appointments.js";
import { getDoctorById } from "./doctors-profile.js";
import { searchDoctors } from "./doctors-search.js";
import { createReview, getPatientReviews } from "./reviews.js";

const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);
const FREE_SLOT = zonedTimeToUtc(2026, 8, 11, 10, 0, 0);

describe("reviews", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("creates a review on a completed visit and updates aggregates", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const apt = await bookAppointment({
      doctorId,
      patientId,
      startAt: FREE_SLOT,
      format: "offline",
      now: NOW,
    });
    await markCompleted({ appointmentId: apt.id, doctorId, now: NOW });

    const review = await createReview({
      patientId,
      appointmentId: apt.id,
      rating: 5,
      text: "Great",
    });
    expect(review.rating).toBe(5);

    const profile = await getDoctorById({ doctorId });
    expect(profile.reviewCount).toBe(1);
    expect(profile.ratingAverage).toBe(5);
    expect(profile.reviews).toHaveLength(1);

    const search = await searchDoctors({ minRating: 4, now: NOW });
    expect(search.items.some((d) => d.id === doctorId)).toBe(true);

    const mine = await getPatientReviews(patientId);
    expect(mine.left).toHaveLength(1);
    expect(mine.pending).toHaveLength(0);
  });

  it("rejects review on Upcoming and duplicate review", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const apt = await bookAppointment({
      doctorId,
      patientId,
      startAt: FREE_SLOT,
      format: "offline",
      now: NOW,
    });

    await expect(
      createReview({ patientId, appointmentId: apt.id, rating: 4 }),
    ).rejects.toMatchObject({ code: "REVIEW_FORBIDDEN" });

    await markCompleted({ appointmentId: apt.id, doctorId, now: NOW });
    await createReview({ patientId, appointmentId: apt.id, rating: 4 });
    await expect(
      createReview({ patientId, appointmentId: apt.id, rating: 3 }),
    ).rejects.toMatchObject({ code: "REVIEW_ALREADY_EXISTS" });
  });
});
