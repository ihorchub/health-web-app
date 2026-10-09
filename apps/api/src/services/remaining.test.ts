import { afterEach, describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { bookAppointment, doctorPropose } from "./appointments.js";
import { getDoctorDashboard } from "./doctor-dashboard.js";
import { getPatientCabinet } from "./patient-cabinet.js";
import {
  getDoctorScheduleForUser,
  patchDoctorSchedule,
  bulkCancelAppointments,
} from "./doctor-schedule.js";
import { getPatientProfile, patchPatientProfile, getDoctorProfile, patchDoctorProfile } from "./me-profile.js";
import { listUnread } from "./notifications.js";

const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);
const FREE_SLOT = zonedTimeToUtc(2026, 8, 11, 10, 0, 0);
const OTHER_FREE_SLOT = zonedTimeToUtc(2026, 8, 11, 10, 30, 0);

describe("doctor-dashboard", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("returns visits and metrics for the day", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    const dash = await getDoctorDashboard({ doctorId, date: "2026-08-11", now: NOW });

    expect(dash.metrics.visitsToday).toBe(1);
    expect(dash.visits).toHaveLength(1);
    expect(dash.freeWindowsToday.length).toBeGreaterThan(0);
    const stripDay = dash.weekStrip.find((d) => d.date === "2026-08-11");
    expect(stripDay?.visits).toBe(1);
    expect(dash.weekStrip).toHaveLength(7);
  });

  it("isolates another doctor's visits", async () => {
    const doctorA = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    const doctorB = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorA, doctorB, patientId);

    await bookAppointment({ doctorId: doctorA, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    const dash = await getDoctorDashboard({ doctorId: doctorB, date: "2026-08-11", now: NOW });
    expect(dash.visits).toHaveLength(0);
  });
});

describe("patient-cabinet", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("groups upcoming and shows pending banner", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const booked = await bookAppointment({
      doctorId,
      patientId,
      startAt: FREE_SLOT,
      format: "offline",
      now: NOW,
    });
    await doctorPropose({
      appointmentId: booked.id,
      doctorId,
      proposedStartAt: OTHER_FREE_SLOT,
      now: NOW,
    });

    const cabinet = await getPatientCabinet(patientId, NOW);
    expect(cabinet.upcoming).toHaveLength(1);
    expect(cabinet.pendingBanner?.id).toBe(booked.id);
    expect(cabinet.upcoming[0]?.canMove).toBe(false);
  });
});

describe("me-profile", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("gets and patches patient profile", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);

    const profile = await getPatientProfile(patientId);
    expect(profile.firstName).toBe("Test");

    const updated = await patchPatientProfile(patientId, {
      firstName: "Oksana",
      phone: "+380501112233",
      photoUrl: "uploads/photos/test_photo.jpg",
    });
    expect(updated.firstName).toBe("Oksana");
    expect(updated.phone).toBe("+380501112233");
    expect(updated.photoUrl).toBe("uploads/photos/test_photo.jpg");
  });

  it("gets and patches doctor profile with education", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    createdUserIds.push(doctorId);

    const updated = await patchDoctorProfile(doctorId, {
      bio: "Hello",
      education: [
        {
          kind: "university",
          title: "NMU",
          yearFrom: 2005,
          yearTo: 2011,
          imageUrl: "uploads/certificates/test_cert.jpg",
        },
      ],
    });
    expect(updated.bio).toBe("Hello");
    expect(updated.education).toHaveLength(1);
    expect((await getDoctorProfile(doctorId)).education[0]?.title).toBe("NMU");
    expect((await getDoctorProfile(doctorId)).education[0]?.imageUrl).toBe(
      "uploads/certificates/test_cert.jpg",
    );
  });
});

describe("doctor-schedule", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("returns zone metadata on GET", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    createdUserIds.push(doctorId);
    const schedule = await getDoctorScheduleForUser(doctorId, NOW);
    expect(schedule.zoneAStart).toBe("2026-08-10");
    expect(schedule.zoneAEnd).toBe("2026-09-09");
    expect(schedule.frozenInZoneA.hours).toBe(true);
  });

  it("rejects frozen weeklyTemplate patch", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    createdUserIds.push(doctorId);
    await expect(
      patchDoctorSchedule(doctorId, { weeklyTemplate: workingWeeklyTemplate() }, NOW),
    ).rejects.toMatchObject({ code: "SCHEDULE_ZONE_FROZEN" });
  });

  it("allows zone B template and vacation", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    createdUserIds.push(doctorId);
    const updated = await patchDoctorSchedule(
      doctorId,
      {
        zoneBVisitDurationMinutes: 45,
        vacationDates: ["2026-10-01"],
        promoPriceUah: 400,
      },
      NOW,
    );
    expect(updated.visitDurationMinutes).toBe(45);
    expect(updated.vacationDates).toContain("2026-10-01");
    expect(updated.promoPriceUah).toBe(400);
  });

  it("bulk-cancels a whole day and notifies patients", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);
    await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const preview = await bulkCancelAppointments({
      doctorId,
      scope: "whole_day",
      from: "2026-08-11",
      confirm: false,
      now: NOW,
    });
    expect(preview.matchedCount).toBe(1);
    expect(preview.cancelledIds).toHaveLength(0);

    const result = await bulkCancelAppointments({
      doctorId,
      scope: "whole_day",
      from: "2026-08-11",
      confirm: true,
      now: NOW,
    });
    expect(result.cancelledIds).toHaveLength(1);
    expect(result.matchedCount).toBe(1);
    expect((await listUnread(patientId)).unreadCount).toBeGreaterThan(0);
  });
});
