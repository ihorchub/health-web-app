import { and, count, eq } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { doctorEducation } from "../db/schema/doctor-education.js";
import { doctorProfiles, patientProfiles } from "../db/schema/profiles.js";
import { cities, clinics } from "../db/schema/reference.js";
import { users } from "../db/schema/users.js";
import { ApiError } from "../lib/errors.js";
import { newId } from "../lib/ids.js";

export async function getPatientProfile(userId: string) {
  const db = getDb();
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: patientProfiles.firstName,
      lastName: patientProfiles.lastName,
      dob: patientProfiles.dob,
      gender: patientProfiles.gender,
      phone: patientProfiles.phone,
      photoUrl: patientProfiles.photoUrl,
      homeCityId: patientProfiles.homeCityId,
      homeClinicId: patientProfiles.homeClinicId,
      language: patientProfiles.language,
      theme: patientProfiles.theme,
    })
    .from(users)
    .innerJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) throw new ApiError("AUTH_FORBIDDEN", 403);
  return row;
}

export async function patchPatientProfile(userId: string, body: Record<string, unknown>) {
  const current = await getPatientProfile(userId);
  const db = getDb();

  if (typeof body.email === "string" && body.email !== current.email) {
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email)).limit(1);
    if (taken) throw new ApiError("AUTH_EMAIL_TAKEN", 409);
    await db.update(users).set({ email: body.email }).where(eq(users.id, userId));
  }

  const profilePatch: Partial<typeof patientProfiles.$inferInsert> = {};
  if (typeof body.firstName === "string") profilePatch.firstName = body.firstName;
  if (typeof body.lastName === "string") profilePatch.lastName = body.lastName;
  if (typeof body.phone === "string" || body.phone === null) profilePatch.phone = (body.phone as string) ?? null;
  if (typeof body.dob === "string") profilePatch.dob = body.dob;
  if (body.gender === "female" || body.gender === "male") profilePatch.gender = body.gender;
  if (typeof body.homeCityId === "string") {
    const [city] = await db.select().from(cities).where(eq(cities.id, body.homeCityId)).limit(1);
    if (!city) throw new ApiError("AUTH_VALIDATION_FAILED", 400, { homeCityId: "INVALID" });
    profilePatch.homeCityId = body.homeCityId;
  }
  if (typeof body.homeClinicId === "string") {
    const [clinic] = await db.select().from(clinics).where(eq(clinics.id, body.homeClinicId)).limit(1);
    if (!clinic) throw new ApiError("AUTH_VALIDATION_FAILED", 400, { homeClinicId: "INVALID" });
    profilePatch.homeClinicId = body.homeClinicId;
  }
  if (typeof body.photoUrl === "string" || body.photoUrl === null) {
    profilePatch.photoUrl = (body.photoUrl as string) ?? null;
  }
  if (typeof body.language === "string") profilePatch.language = body.language;
  if (typeof body.theme === "string") profilePatch.theme = body.theme;

  if (Object.keys(profilePatch).length > 0) {
    await db.update(patientProfiles).set(profilePatch).where(eq(patientProfiles.userId, userId));
  }

  return getPatientProfile(userId);
}

export type EducationInput = {
  id?: string;
  kind: "university" | "certificate" | "training";
  title: string;
  subtitle?: string;
  yearFrom: number;
  yearTo?: number;
};

export async function getDoctorProfile(userId: string) {
  const db = getDb();
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: doctorProfiles.firstName,
      lastName: doctorProfiles.lastName,
      dob: doctorProfiles.dob,
      phone: doctorProfiles.phone,
      cityId: doctorProfiles.cityId,
      clinicId: doctorProfiles.clinicId,
      specialty: doctorProfiles.specialty,
      yearsPractice: doctorProfiles.yearsPractice,
      photoUrl: doctorProfiles.photoUrl,
      licenseFileUrl: doctorProfiles.licenseFileUrl,
      bio: doctorProfiles.bio,
      languages: doctorProfiles.languages,
      language: doctorProfiles.language,
      theme: doctorProfiles.theme,
    })
    .from(users)
    .innerJoin(doctorProfiles, eq(doctorProfiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) throw new ApiError("AUTH_FORBIDDEN", 403);

  const education = await db
    .select()
    .from(doctorEducation)
    .where(eq(doctorEducation.doctorUserId, userId));

  const [completed] = await db
    .select({ value: count() })
    .from(appointments)
    .where(and(eq(appointments.doctorId, userId), eq(appointments.status, "Completed")));

  return {
    ...row,
    education: education.map((e) => ({
      id: e.id,
      kind: e.kind,
      title: e.title,
      subtitle: e.subtitle,
      yearFrom: e.yearFrom,
      yearTo: e.yearTo,
    })),
    consultationCount: Number(completed?.value ?? 0),
  };
}

export async function patchDoctorProfile(userId: string, body: Record<string, unknown>) {
  const current = await getDoctorProfile(userId);
  const db = getDb();

  if (typeof body.email === "string" && body.email !== current.email) {
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email)).limit(1);
    if (taken) throw new ApiError("AUTH_EMAIL_TAKEN", 409);
    await db.update(users).set({ email: body.email }).where(eq(users.id, userId));
  }

  const profilePatch: Partial<typeof doctorProfiles.$inferInsert> = {};
  if (typeof body.firstName === "string") profilePatch.firstName = body.firstName;
  if (typeof body.lastName === "string") profilePatch.lastName = body.lastName;
  if (typeof body.phone === "string" || body.phone === null) profilePatch.phone = (body.phone as string) ?? null;
  if (typeof body.cityId === "string") {
    const [city] = await db.select().from(cities).where(eq(cities.id, body.cityId)).limit(1);
    if (!city) throw new ApiError("AUTH_VALIDATION_FAILED", 400, { cityId: "INVALID" });
    profilePatch.cityId = body.cityId;
  }
  if (typeof body.clinicId === "string") {
    const [clinic] = await db.select().from(clinics).where(eq(clinics.id, body.clinicId)).limit(1);
    if (!clinic) throw new ApiError("AUTH_VALIDATION_FAILED", 400, { clinicId: "INVALID" });
    profilePatch.clinicId = body.clinicId;
  }
  if (typeof body.bio === "string" || body.bio === null) profilePatch.bio = (body.bio as string) ?? null;
  if (Array.isArray(body.languages)) profilePatch.languages = body.languages as string[];
  if (typeof body.photoUrl === "string" || body.photoUrl === null) {
    profilePatch.photoUrl = (body.photoUrl as string) ?? null;
  }
  if (typeof body.language === "string") profilePatch.language = body.language;
  if (typeof body.theme === "string") profilePatch.theme = body.theme;

  if (Object.keys(profilePatch).length > 0) {
    await db.update(doctorProfiles).set(profilePatch).where(eq(doctorProfiles.userId, userId));
  }

  if (Array.isArray(body.education)) {
    const items = body.education as EducationInput[];
    await db.delete(doctorEducation).where(eq(doctorEducation.doctorUserId, userId));
    if (items.length > 0) {
      await db.insert(doctorEducation).values(
        items.map((item) => ({
          id: item.id ?? newId("edu"),
          doctorUserId: userId,
          kind: item.kind,
          title: item.title,
          subtitle: item.subtitle ?? null,
          yearFrom: item.yearFrom,
          yearTo: item.yearTo ?? null,
        })),
      );
    }
  }

  return getDoctorProfile(userId);
}
