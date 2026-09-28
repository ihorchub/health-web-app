import { afterEach, describe, expect, it } from "vitest";

import { ApiError } from "../lib/errors.js";
import {
  cleanupTestData,
  createTestDoctor,
  createTestPatient,
  workingWeeklyTemplate,
} from "../test/fixtures.js";
import { createNotification, listUnread, markAllRead, markRead } from "./notifications.js";

describe("notifications", () => {
  const createdUserIds: string[] = [];
  afterEach(async () => {
    await cleanupTestData(createdUserIds.splice(0));
  });

  it("creates and lists unread notifications", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);

    await createNotification({
      userId: patientId,
      type: "appointment_booked",
      payload: { appointmentId: "apt_1" },
    });

    const listed = await listUnread(patientId);
    expect(listed.unreadCount).toBe(1);
    expect(listed.items[0]?.type).toBe("appointment_booked");
    expect(listed.items[0]?.payload).toEqual({ appointmentId: "apt_1" });
    expect(listed.items[0]?.read).toBe(false);
  });

  it("markRead removes item from unread list", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);
    const ntf = await createNotification({ userId: patientId, type: "test" });

    await markRead(patientId, ntf.id);
    const listed = await listUnread(patientId);
    expect(listed.unreadCount).toBe(0);
  });

  it("markAllRead clears all unread", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);
    await createNotification({ userId: patientId, type: "a" });
    await createNotification({ userId: patientId, type: "b" });

    await markAllRead(patientId);
    expect((await listUnread(patientId)).unreadCount).toBe(0);
  });

  it("forbids marking another user's notification", async () => {
    const patientId = await createTestPatient();
    const otherId = await createTestPatient();
    createdUserIds.push(patientId, otherId);
    const ntf = await createNotification({ userId: patientId, type: "test" });

    await expect(markRead(otherId, ntf.id)).rejects.toMatchObject({
      code: "NOTIFICATION_FORBIDDEN",
    } satisfies Partial<ApiError>);
  });

  it("returns NOTIFICATION_NOT_FOUND for unknown id", async () => {
    const patientId = await createTestPatient();
    createdUserIds.push(patientId);
    await expect(markRead(patientId, "ntf_missing")).rejects.toMatchObject({
      code: "NOTIFICATION_NOT_FOUND",
    });
  });

  it("isolates notifications per user", async () => {
    const doctorId = await createTestDoctor({ weeklyTemplate: workingWeeklyTemplate() });
    const patientId = await createTestPatient();
    createdUserIds.push(doctorId, patientId);

    await createNotification({ userId: doctorId, type: "for_doctor" });
    await createNotification({ userId: patientId, type: "for_patient" });

    expect((await listUnread(doctorId)).items.map((i) => i.type)).toEqual(["for_doctor"]);
    expect((await listUnread(patientId)).items.map((i) => i.type)).toEqual(["for_patient"]);
  });
});
