import { and, eq, gt } from "drizzle-orm";

import { getDb } from "../db/client.js";
import {
  doctorProfiles,
  patientProfiles,
  registrations,
  users,
} from "../db/schema/index.js";
import { clinics } from "../db/schema/reference.js";
import { sendVerificationEmail } from "../lib/email.js";
import { ApiError } from "../lib/errors.js";
import { newId, newToken } from "../lib/ids.js";
import { hashPassword, validatePassword, verifyPassword } from "../lib/password.js";
import { redirectForRole, type UserRole } from "../lib/redirect.js";
import { parseDateOnly, validateEmail } from "../lib/validation.js";
import { config } from "../config.js";
import { createDefaultDoctorSchedule } from "./doctor-schedule.js";
import { createSession } from "../plugins/session.js";

const REGISTRATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

type Logger = { info: (obj: unknown, msg?: string) => void };

async function emailInUse(email: string): Promise<boolean> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, normalized)).limit(1);
  if (user) return true;
  const [reg] = await db
    .select({ id: registrations.id })
    .from(registrations)
    .where(and(eq(registrations.email, normalized), gt(registrations.expiresAt, new Date())))
    .limit(1);
  return Boolean(reg);
}

export async function registerStep1(
  input: {
    role: UserRole;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptedPrivacy: boolean;
    acceptedTerms: boolean;
    language?: string;
    theme?: string;
  },
  log: Logger,
) {
  if (!input.acceptedPrivacy || !input.acceptedTerms) {
    throw new ApiError("AUTH_CONSENT_REQUIRED", 400);
  }
  const fields: Record<string, string> = {};
  if (!input.firstName.trim()) fields.firstName = "REQUIRED";
  if (!input.lastName.trim()) fields.lastName = "REQUIRED";
  if (!validateEmail(input.email)) fields.email = "INVALID";
  const pw = validatePassword(input.password);
  if (pw) fields.password = pw;
  if (Object.keys(fields).length) throw new ApiError("AUTH_VALIDATION_FAILED", 400, fields);

  const email = input.email.trim().toLowerCase();
  if (await emailInUse(email)) throw new ApiError("AUTH_EMAIL_TAKEN", 409);

  const id = newId("reg");
  const token = newToken();
  const now = new Date();
  const passwordHash = await hashPassword(input.password);

  await getDb().insert(registrations).values({
    id,
    role: input.role,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    passwordHash,
    acceptedPrivacy: input.acceptedPrivacy,
    acceptedTerms: input.acceptedTerms,
    language: input.language,
    theme: input.theme,
    emailVerifyToken: token,
    emailVerifyExpiresAt: new Date(now.getTime() + VERIFY_TTL_MS),
    emailVerifySentAt: now,
    expiresAt: new Date(now.getTime() + REGISTRATION_TTL_MS),
  });

  sendVerificationEmail({ email, registrationId: id, token, log });

  return {
    registrationId: id,
    email,
    role: input.role,
    nextStep: "email" as const,
    ...(config.nodeEnv === "development" ? { devVerifyToken: token } : {}),
  };
}

export async function getRegistrationStatus(registrationId: string) {
  const row = await loadRegistration(registrationId);
  let nextStep: "email" | "profile" | "done" | "complete";
  if (!row.emailVerifiedAt) nextStep = "email";
  else if (!row.profileCompletedAt) nextStep = "profile";
  else nextStep = "done";

  return {
    registrationId: row.id,
    role: row.role,
    email: row.email,
    emailVerified: Boolean(row.emailVerifiedAt),
    profileCompleted: Boolean(row.profileCompletedAt),
    nextStep,
  };
}

async function loadRegistration(registrationId: string) {
  const [row] = await getDb()
    .select()
    .from(registrations)
    .where(eq(registrations.id, registrationId))
    .limit(1);
  if (!row || row.expiresAt < new Date()) {
    throw new ApiError("AUTH_REGISTRATION_NOT_FOUND", 404);
  }
  return row;
}

export async function verifyEmail(registrationId: string, token: string) {
  const row = await loadRegistration(registrationId);
  if (row.emailVerifiedAt) {
    return {
      registrationId,
      emailVerified: true,
      role: row.role,
      nextStep: "profile" as const,
    };
  }
  if (row.emailVerifyExpiresAt < new Date()) {
    throw new ApiError("AUTH_TOKEN_EXPIRED", 400);
  }
  if (row.emailVerifyToken !== token) {
    throw new ApiError("AUTH_INVALID_TOKEN", 400);
  }
  await getDb()
    .update(registrations)
    .set({ emailVerifiedAt: new Date() })
    .where(eq(registrations.id, registrationId));

  return {
    registrationId,
    emailVerified: true,
    role: row.role,
    nextStep: "profile" as const,
  };
}

export async function resendEmail(registrationId: string, log: Logger) {
  const row = await loadRegistration(registrationId);
  if (row.emailVerifiedAt) throw new ApiError("AUTH_ALREADY_VERIFIED", 400);
  const now = new Date();
  if (now.getTime() - row.emailVerifySentAt.getTime() < RESEND_COOLDOWN_MS) {
    throw new ApiError("AUTH_RESEND_TOO_SOON", 429);
  }
  const token = newToken();
  await getDb()
    .update(registrations)
    .set({
      emailVerifyToken: token,
      emailVerifyExpiresAt: new Date(now.getTime() + VERIFY_TTL_MS),
      emailVerifySentAt: now,
    })
    .where(eq(registrations.id, registrationId));

  sendVerificationEmail({ email: row.email, registrationId, token, log });
  return { ok: true as const, sentTo: row.email };
}

async function assertClinicInCity(cityId: string, clinicId: string) {
  const [clinic] = await getDb()
    .select()
    .from(clinics)
    .where(and(eq(clinics.id, clinicId), eq(clinics.cityId, cityId)))
    .limit(1);
  if (!clinic) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { clinicId: "INVALID" });
  }
}

export async function registerStep3Patient(input: {
  registrationId: string;
  dob: string;
  gender: "female" | "male";
  cityId: string;
  clinicId: string;
}) {
  const row = await loadRegistration(input.registrationId);
  if (!row.emailVerifiedAt) throw new ApiError("AUTH_EMAIL_NOT_VERIFIED", 400);
  if (row.role !== "patient") throw new ApiError("AUTH_FORBIDDEN_STEP", 400);

  const fields: Record<string, string> = {};
  if (!parseDateOnly(input.dob)) fields.dob = "INVALID";
  if (input.gender !== "female" && input.gender !== "male") fields.gender = "INVALID";
  if (Object.keys(fields).length) throw new ApiError("AUTH_VALIDATION_FAILED", 400, fields);

  await assertClinicInCity(input.cityId, input.clinicId);

  await getDb()
    .update(registrations)
    .set({
      profileData: {
        dob: input.dob,
        gender: input.gender,
        cityId: input.cityId,
        clinicId: input.clinicId,
      },
      profileCompletedAt: new Date(),
    })
    .where(eq(registrations.id, input.registrationId));

  return {
    registrationId: input.registrationId,
    profileCompleted: true,
    nextStep: "done" as const,
  };
}

export async function registerStep3Doctor(input: {
  registrationId: string;
  dob: string;
  cityId: string;
  clinicId: string;
  specialty: "family_doctor" | "cardiologist" | "dermatologist" | "paediatrician";
  yearsPractice: number;
  visitDurationMinutes: 20 | 30 | 45;
  licenseFileUrl?: string | null;
}) {
  const row = await loadRegistration(input.registrationId);
  if (!row.emailVerifiedAt) throw new ApiError("AUTH_EMAIL_NOT_VERIFIED", 400);
  if (row.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN_STEP", 400);

  const fields: Record<string, string> = {};
  if (!parseDateOnly(input.dob)) fields.dob = "INVALID";
  if (input.yearsPractice < 0) fields.yearsPractice = "INVALID";
  if (![20, 30, 45].includes(input.visitDurationMinutes)) {
    fields.visitDurationMinutes = "INVALID";
  }
  if (Object.keys(fields).length) throw new ApiError("AUTH_VALIDATION_FAILED", 400, fields);

  await assertClinicInCity(input.cityId, input.clinicId);

  await getDb()
    .update(registrations)
    .set({
      profileData: {
        dob: input.dob,
        cityId: input.cityId,
        clinicId: input.clinicId,
        specialty: input.specialty,
        yearsPractice: input.yearsPractice,
        visitDurationMinutes: input.visitDurationMinutes,
        licenseFileUrl: input.licenseFileUrl ?? null,
      },
      profileCompletedAt: new Date(),
    })
    .where(eq(registrations.id, input.registrationId));

  return {
    registrationId: input.registrationId,
    profileCompleted: true,
    nextStep: "done" as const,
  };
}

export async function registerComplete(registrationId: string) {
  const row = await loadRegistration(registrationId);
  if (!row.emailVerifiedAt) throw new ApiError("AUTH_EMAIL_NOT_VERIFIED", 400);
  if (!row.profileCompletedAt || !row.profileData) {
    throw new ApiError("AUTH_PROFILE_INCOMPLETE", 400);
  }

  const userId = newId("usr");
  const db = getDb();

  await db.transaction(async (tx) => {
    await tx.insert(users).values({
      id: userId,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role,
      emailVerifiedAt: row.emailVerifiedAt,
    });

    const data = row.profileData as Record<string, unknown>;

    if (row.role === "patient") {
      await tx.insert(patientProfiles).values({
        userId,
        firstName: row.firstName,
        lastName: row.lastName,
        dob: String(data.dob),
        gender: data.gender as "female" | "male",
        homeCityId: String(data.cityId),
        homeClinicId: String(data.clinicId),
        language: row.language,
        theme: row.theme,
      });
    } else {
      const visitDurationMinutes = Number(data.visitDurationMinutes);
      await tx.insert(doctorProfiles).values({
        userId,
        firstName: row.firstName,
        lastName: row.lastName,
        dob: String(data.dob),
        cityId: String(data.cityId),
        clinicId: String(data.clinicId),
        specialty: data.specialty as "family_doctor" | "cardiologist" | "dermatologist" | "paediatrician",
        yearsPractice: Number(data.yearsPractice),
        visitDurationMinutes,
        licenseFileUrl: data.licenseFileUrl ? String(data.licenseFileUrl) : null,
        language: row.language,
        theme: row.theme,
      });
      await createDefaultDoctorSchedule(tx, userId);
    }

    await tx.delete(registrations).where(eq(registrations.id, registrationId));
  });

  const session = await createSession(userId);
  return {
    userId,
    role: row.role,
    redirectTo: redirectForRole(row.role),
    session,
  };
}

export async function login(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!validateEmail(normalized)) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { email: "INVALID" });
  }
  const [user] = await getDb().select().from(users).where(eq(users.email, normalized)).limit(1);
  if (!user) throw new ApiError("AUTH_INVALID_CREDENTIALS", 401);

  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) throw new ApiError("AUTH_INVALID_CREDENTIALS", 401);

  const session = await createSession(user.id);
  return {
    userId: user.id,
    role: user.role as UserRole,
    redirectTo: redirectForRole(user.role as UserRole),
    session,
  };
}
