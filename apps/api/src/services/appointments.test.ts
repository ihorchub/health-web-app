import { afterEach, describe, expect, it } from "vitest";

import { ApiError } from "../lib/errors.js";
import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import {
  autoCompleteDueAppointments,
  bookAppointment,
  cancelAppointment,
  doctorPropose,
  getAppointmentById,
  getPendingDecision,
  markCompleted,
  patientAcceptProposal,
  patientReschedule,
} from "./appointments.js";

// Fixed "now": Monday 10 Aug 2026, 08:00 Kyiv. All test slots are chosen relative to this.
const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0);
const FREE_SLOT = zonedTimeToUtc(2026, 8, 11, 10, 0, 0); // Tuesday 10:00 Kyiv
const OTHER_FREE_SLOT = zonedTimeToUtc(2026, 8, 11, 10, 30, 0);

async function setupDoctorAndPatient() {
  const doctorId = await createTestDoctor({
    weeklyTemplate: workingWeeklyTemplate(),
    visitDurationMinutes: 30,
    supportedFormats: ["offline", "online"],
  });
  const patientId = await createTestPatient();
  return { doctorId, patientId };
}

describe("bookAppointment", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("books a free slot as Upcoming", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);

    const appointment = await bookAppointment({
      doctorId,
      patientId,
      startAt: FREE_SLOT,
      format: "offline",
      reason: "Check-up",
      now: NOW,
    });

    expect(appointment.status).toBe("Upcoming");
    expect(appointment.startAt.toISOString()).toBe(FREE_SLOT.toISOString());
    expect(appointment.durationMinutes).toBe(30);
    expect(appointment.reason).toBe("Check-up");
  });

  it("rejects a slot outside the Zone A window with SLOT_OUTSIDE_WINDOW", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);

    const farFuture = zonedTimeToUtc(2026, 12, 1, 10, 0, 0);
    await expect(
      bookAppointment({ doctorId, patientId, startAt: farFuture, format: "offline", now: NOW }),
    ).rejects.toMatchObject({ code: "SLOT_OUTSIDE_WINDOW" } satisfies Partial<ApiError>);
  });

  it("rejects a slot outside working hours with SLOT_NOT_FREE", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);

    const beforeOpening = zonedTimeToUtc(2026, 8, 11, 7, 0, 0);
    await expect(
      bookAppointment({ doctorId, patientId, startAt: beforeOpening, format: "offline", now: NOW }),
    ).rejects.toMatchObject({ code: "SLOT_NOT_FREE" });
  });

  it("rejects an unsupported format with AUTH_VALIDATION_FAILED", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    await expect(
      bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "online", now: NOW }),
    ).rejects.toMatchObject({ code: "AUTH_VALIDATION_FAILED" });
  });

  it("rejects a second booking for the same doctor+time with SLOT_TAKEN", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    const secondPatientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId, secondPatientId);

    await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    await expect(
      bookAppointment({ doctorId, patientId: secondPatientId, startAt: FREE_SLOT, format: "offline", now: NOW }),
    ).rejects.toMatchObject({ code: "SLOT_TAKEN" });
  });

  it("FLO-06: only one of two concurrent bookings for the same slot succeeds, the other gets SLOT_TAKEN", async () => {
    const { doctorId } = await setupDoctorAndPatient();
    const patientA = await createTestPatient();
    const patientB = await createTestPatient();
    createdUserIds.push(doctorId, patientA, patientB);

    const [resultA, resultB] = await Promise.allSettled([
      bookAppointment({ doctorId, patientId: patientA, startAt: OTHER_FREE_SLOT, format: "offline", now: NOW }),
      bookAppointment({ doctorId, patientId: patientB, startAt: OTHER_FREE_SLOT, format: "offline", now: NOW }),
    ]);

    const outcomes = [resultA, resultB];
    const fulfilled = outcomes.filter((r) => r.status === "fulfilled");
    const rejected = outcomes.filter((r) => r.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toMatchObject({ code: "SLOT_TAKEN" });
  });
});

describe("cancelAppointment", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("cancels the owning patient's Upcoming appointment", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const cancelled = await cancelAppointment({
      appointmentId: booked.id,
      actorId: patientId,
      actorRole: "patient",
    });

    expect(cancelled.status).toBe("Cancelled");
    expect(cancelled.cancelledBy).toBe("patient");
  });

  it("lets the owning doctor cancel too, setting cancelledBy=doctor", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const cancelled = await cancelAppointment({ appointmentId: booked.id, actorId: doctorId, actorRole: "doctor" });

    expect(cancelled.cancelledBy).toBe("doctor");
  });

  it("rejects cancelling someone else's appointment with APPOINTMENT_FORBIDDEN", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    const strangerId = await createTestPatient();
    createdUserIds.push(doctorId, patientId, strangerId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    await expect(
      cancelAppointment({ appointmentId: booked.id, actorId: strangerId, actorRole: "patient" }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_FORBIDDEN" });
  });

  it("rejects cancelling an already-cancelled appointment with APPOINTMENT_INVALID_TRANSITION", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    await cancelAppointment({ appointmentId: booked.id, actorId: patientId, actorRole: "patient" });

    await expect(
      cancelAppointment({ appointmentId: booked.id, actorId: patientId, actorRole: "patient" }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_INVALID_TRANSITION" });
  });
});

describe("markCompleted", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("lets the owning doctor mark an Upcoming appointment Completed", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const completed = await markCompleted({ appointmentId: booked.id, doctorId, now: NOW });

    expect(completed.status).toBe("Completed");
    expect(completed.completedAt).not.toBeNull();
  });

  it("rejects a different doctor with APPOINTMENT_FORBIDDEN", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    const otherDoctorId = await createTestDoctor();
    createdUserIds.push(doctorId, patientId, otherDoctorId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    await expect(
      markCompleted({ appointmentId: booked.id, doctorId: otherDoctorId, now: NOW }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_FORBIDDEN" });
  });
});

describe("patientReschedule", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("moves the patient to a new Upcoming slot and marks the old row Rescheduled", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const { oldAppointment, newAppointment } = await patientReschedule({
      appointmentId: booked.id,
      patientId,
      newStartAt: OTHER_FREE_SLOT,
      format: "offline",
      now: NOW,
    });

    expect(oldAppointment.status).toBe("Rescheduled");
    expect(newAppointment.status).toBe("Upcoming");
    expect(newAppointment.startAt.toISOString()).toBe(OTHER_FREE_SLOT.toISOString());
    expect(newAppointment.replacesAppointmentId).toBe(booked.id);
  });

  it("rejects rescheduling an appointment that is not Upcoming", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    await cancelAppointment({ appointmentId: booked.id, actorId: patientId, actorRole: "patient" });

    await expect(
      patientReschedule({
        appointmentId: booked.id,
        patientId,
        newStartAt: OTHER_FREE_SLOT,
        format: "offline",
        now: NOW,
      }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_INVALID_TRANSITION" });
  });
});

describe("autoCompleteDueAppointments", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("completes Upcoming appointments whose end time has passed, and no others", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);

    const past = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    const future = await bookAppointment({
      doctorId,
      patientId,
      startAt: OTHER_FREE_SLOT,
      format: "offline",
      now: NOW,
    });

    // "later" is after FREE_SLOT (10:00) + 30 min duration, but before OTHER_FREE_SLOT (10:30) ends.
    const later = zonedTimeToUtc(2026, 8, 11, 10, 31, 0);
    await autoCompleteDueAppointments(later);

    expect((await getAppointmentById(past.id)).status).toBe("Completed");
    expect((await getAppointmentById(future.id)).status).toBe("Upcoming");
  });
});

describe("doctorPropose and patientAcceptProposal", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("proposes a new slot and accepts into a new Upcoming row", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    const pending = await doctorPropose({
      appointmentId: booked.id,
      doctorId,
      proposedStartAt: OTHER_FREE_SLOT,
      now: NOW,
    });
    expect(pending.status).toBe("Reschedule Pending");
    expect(pending.proposedStartAt?.toISOString()).toBe(OTHER_FREE_SLOT.toISOString());

    const decision = await getPendingDecision({ appointmentId: booked.id, patientId });
    expect(decision.proposedStartAt).toBe(OTHER_FREE_SLOT.toISOString());

    const { oldAppointment, newAppointment } = await patientAcceptProposal({
      appointmentId: booked.id,
      patientId,
      now: NOW,
    });
    expect(oldAppointment.status).toBe("Rescheduled");
    expect(newAppointment.status).toBe("Upcoming");
    expect(newAppointment.startAt.toISOString()).toBe(OTHER_FREE_SLOT.toISOString());
  });

  it("rejects a second propose while pending", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    createdUserIds.push(doctorId, patientId);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });
    await doctorPropose({
      appointmentId: booked.id,
      doctorId,
      proposedStartAt: OTHER_FREE_SLOT,
      now: NOW,
    });

    const third = zonedTimeToUtc(2026, 8, 11, 11, 0, 0);
    await expect(
      doctorPropose({ appointmentId: booked.id, doctorId, proposedStartAt: third, now: NOW }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_PENDING_EXISTS" });
  });

  it("rejects propose from wrong doctor", async () => {
    const { doctorId, patientId } = await setupDoctorAndPatient();
    const otherDoctor = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    createdUserIds.push(doctorId, patientId, otherDoctor);
    const booked = await bookAppointment({ doctorId, patientId, startAt: FREE_SLOT, format: "offline", now: NOW });

    await expect(
      doctorPropose({
        appointmentId: booked.id,
        doctorId: otherDoctor,
        proposedStartAt: OTHER_FREE_SLOT,
        now: NOW,
      }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_FORBIDDEN" });
  });
});
