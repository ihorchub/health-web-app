import { afterEach, describe, expect, it } from "vitest";

import { zonedTimeToUtc } from "../lib/timezone.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { bookAppointment } from "./appointments.js";
import { getDoctorCalendar } from "./calendar.js";

const NOW = zonedTimeToUtc(2026, 8, 10, 8, 0, 0); // Monday 10 Aug 2026, 08:00 Kyiv

describe("getDoctorCalendar", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("throws DOCTOR_NOT_FOUND for an unknown doctor", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);

    await expect(
      getDoctorCalendar({ doctorId: "no-such-doctor", patientId, now: NOW }),
    ).rejects.toMatchObject({ code: "DOCTOR_NOT_FOUND" });
  });

  it("defaults to zoneAStart and returns free slots for a working day", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      visitDurationMinutes: 30,
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const result = await getDoctorCalendar({ doctorId, patientId, now: NOW });

    expect(result.doctorId).toBe(doctorId);
    expect(result.zoneAStart).toBe("2026-08-10");
    expect(result.zoneAEnd).toBe("2026-09-09");
    expect(result.visitDurationMinutes).toBe(30);
    expect(result.supportedFormats).toEqual(["offline"]);
    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots.every((s) => s.status === "free" || s.status === "past")).toBe(true);
  });

  it("reflects a booked appointment as taken on the requested date", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      visitDurationMinutes: 30,
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const bookedAt = zonedTimeToUtc(2026, 8, 11, 10, 0, 0);
    await bookAppointment({ doctorId, patientId, startAt: bookedAt, format: "offline", now: NOW });

    const result = await getDoctorCalendar({ doctorId, patientId, date: "2026-08-11", now: NOW });

    const slot = result.slots.find((s) => s.startAt === bookedAt.toISOString());
    expect(slot?.status).toBe("taken");
  });

  it("returns a day-flag summary when from/to are given", async () => {
    const doctorId = await createTestDoctor({
      weeklyTemplate: workingWeeklyTemplate(),
      visitDurationMinutes: 30,
      supportedFormats: ["offline"],
    });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    const result = await getDoctorCalendar({
      doctorId,
      patientId,
      from: "2026-08-10",
      to: "2026-08-16",
      now: NOW,
    });

    expect(result.days).toHaveLength(7);
    // 15/16 Aug 2026 is Sat/Sun -> day_off under workingWeeklyTemplate()
    expect(result.days.find((d) => d.date === "2026-08-15")?.flag).toBe("day_off");
    expect(result.days.find((d) => d.date === "2026-08-11")?.flag).toBe("has_free");
  });

  it("rejects a contextAppointmentId that does not belong to the requesting patient", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    const patientId = await createTestPatient();
    const otherPatientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId, otherPatientId);

    const booked = await bookAppointment({
      doctorId,
      patientId,
      startAt: zonedTimeToUtc(2026, 8, 11, 10, 0, 0),
      format: "offline",
      now: NOW,
    });

    await expect(
      getDoctorCalendar({ doctorId, patientId: otherPatientId, contextAppointmentId: booked.id, now: NOW }),
    ).rejects.toMatchObject({ code: "APPOINTMENT_FORBIDDEN" });
  });
});
