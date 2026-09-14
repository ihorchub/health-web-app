import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { saveLicenseFile } from "../lib/uploads.js";
import {
  clearSessionCookie,
  destroySession,
  SESSION_COOKIE,
  setSessionCookie,
} from "../plugins/session.js";
import { getMeSummary } from "../services/me.js";
import {
  getRegistrationStatus,
  login,
  registerComplete,
  registerStep1,
  registerStep3Doctor,
  registerStep3Patient,
  resendEmail,
  verifyEmail,
} from "../services/registration.js";

const Role = Type.Union([Type.Literal("patient"), Type.Literal("doctor")]);

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/api/v1/auth/register/step-1",
    {
      schema: {
        body: Type.Object({
          role: Role,
          firstName: Type.String(),
          lastName: Type.String(),
          email: Type.String(),
          password: Type.String(),
          acceptedPrivacy: Type.Boolean(),
          acceptedTerms: Type.Boolean(),
          language: Type.Optional(Type.String()),
          theme: Type.Optional(Type.String()),
        }),
      },
    },
    async (request) => {
      return registerStep1(request.body as Parameters<typeof registerStep1>[0], request.log);
    },
  );

  app.get("/api/v1/auth/register/:registrationId/status", async (request) => {
    const { registrationId } = request.params as { registrationId: string };
    return getRegistrationStatus(registrationId);
  });

  app.post(
    "/api/v1/auth/register/verify-email",
    {
      schema: {
        body: Type.Object({
          registrationId: Type.String(),
          token: Type.String(),
        }),
      },
    },
    async (request) => {
      const { registrationId, token } = request.body as { registrationId: string; token: string };
      return verifyEmail(registrationId, token);
    },
  );

  app.post(
    "/api/v1/auth/register/resend-email",
    {
      schema: {
        body: Type.Object({ registrationId: Type.String() }),
      },
    },
    async (request) => {
      const { registrationId } = request.body as { registrationId: string };
      return resendEmail(registrationId, request.log);
    },
  );

  app.post(
    "/api/v1/auth/register/step-3/patient",
    {
      schema: {
        body: Type.Object({
          registrationId: Type.String(),
          dob: Type.String(),
          gender: Type.Union([Type.Literal("female"), Type.Literal("male")]),
          cityId: Type.String(),
          clinicId: Type.String(),
        }),
      },
    },
    async (request) => {
      const body = request.body as {
        registrationId: string;
        dob: string;
        gender: "female" | "male";
        cityId: string;
        clinicId: string;
      };
      return registerStep3Patient(body);
    },
  );

  app.post("/api/v1/auth/register/step-3/doctor", async (request) => {
    const fields: Record<string, string> = {};
    let licenseFileUrl: string | null = null;

    for await (const part of request.parts()) {
      if (part.type === "file") {
        if (part.fieldname !== "licenseFile") continue;
        try {
          licenseFileUrl = await saveLicenseFile(part);
        } catch (err) {
          const code = err instanceof Error ? err.message : "INVALID";
          if (code === "FILE_TOO_LARGE") {
            throw new ApiError("AUTH_VALIDATION_FAILED", 400, { licenseFile: "FILE_TOO_LARGE" });
          }
          throw new ApiError("AUTH_VALIDATION_FAILED", 400, { licenseFile: "INVALID" });
        }
        continue;
      }
      fields[part.fieldname] = String(part.value);
    }

    const registrationId = fields.registrationId;
    const dob = fields.dob;
    const cityId = fields.cityId;
    const clinicId = fields.clinicId;
    const specialty = fields.specialty as
      | "family_doctor"
      | "cardiologist"
      | "dermatologist"
      | "paediatrician"
      | undefined;
    const yearsPractice = Number(fields.yearsPractice);
    const visitDurationMinutes = Number(fields.visitDurationMinutes) as 20 | 30 | 45;

    if (!registrationId || !dob || !cityId || !clinicId || !specialty) {
      throw new ApiError("AUTH_VALIDATION_FAILED", 400, { registrationId: "REQUIRED" });
    }

    return registerStep3Doctor({
      registrationId,
      dob,
      cityId,
      clinicId,
      specialty,
      yearsPractice,
      visitDurationMinutes,
      licenseFileUrl,
    });
  });

  /** @deprecated Prefer step-3/patient or step-3/doctor */
  app.post(
    "/api/v1/auth/register/step-3",
    {
      schema: {
        body: Type.Object({
          registrationId: Type.String(),
          dob: Type.String(),
          gender: Type.Optional(Type.Union([Type.Literal("female"), Type.Literal("male")])),
          cityId: Type.String(),
          clinicId: Type.String(),
          specialty: Type.Optional(
            Type.Union([
              Type.Literal("family_doctor"),
              Type.Literal("cardiologist"),
              Type.Literal("dermatologist"),
              Type.Literal("paediatrician"),
            ]),
          ),
          yearsPractice: Type.Optional(Type.Number()),
          visitDurationMinutes: Type.Optional(
            Type.Union([Type.Literal(20), Type.Literal(30), Type.Literal(45)]),
          ),
        }),
      },
    },
    async (request) => {
      const body = request.body as {
        registrationId: string;
        dob: string;
        gender?: "female" | "male";
        cityId: string;
        clinicId: string;
        specialty?: "family_doctor" | "cardiologist" | "dermatologist" | "paediatrician";
        yearsPractice?: number;
        visitDurationMinutes?: 20 | 30 | 45;
      };

      if (body.specialty !== undefined) {
        if (body.yearsPractice === undefined || body.visitDurationMinutes === undefined) {
          throw new ApiError("AUTH_VALIDATION_FAILED", 400, { yearsPractice: "REQUIRED" });
        }
        return registerStep3Doctor({
          registrationId: body.registrationId,
          dob: body.dob,
          cityId: body.cityId,
          clinicId: body.clinicId,
          specialty: body.specialty,
          yearsPractice: body.yearsPractice,
          visitDurationMinutes: body.visitDurationMinutes,
        });
      }

      if (!body.gender) {
        throw new ApiError("AUTH_VALIDATION_FAILED", 400, { gender: "REQUIRED" });
      }
      return registerStep3Patient({
        registrationId: body.registrationId,
        dob: body.dob,
        gender: body.gender,
        cityId: body.cityId,
        clinicId: body.clinicId,
      });
    },
  );

  app.post(
    "/api/v1/auth/register/complete",
    {
      schema: {
        body: Type.Object({ registrationId: Type.String() }),
      },
    },
    async (request, reply) => {
      const { registrationId } = request.body as { registrationId: string };
      const result = await registerComplete(registrationId);
      setSessionCookie(reply, result.session.id, result.session.expiresAt);
      return {
        userId: result.userId,
        role: result.role,
        redirectTo: result.redirectTo,
      };
    },
  );

  app.post(
    "/api/v1/auth/login",
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };
      const result = await login(email, password);
      setSessionCookie(reply, result.session.id, result.session.expiresAt);
      return {
        userId: result.userId,
        role: result.role,
        redirectTo: result.redirectTo,
      };
    },
  );

  app.post("/api/v1/auth/logout", async (request, reply) => {
    const raw = request.cookies[SESSION_COOKIE];
    if (raw) {
      const unsigned = request.unsignCookie(raw);
      if (unsigned.valid && unsigned.value) {
        await destroySession(unsigned.value);
      }
    }
    clearSessionCookie(reply);
    return { ok: true };
  });

  app.get("/api/v1/auth/me", async (request) => {
    if (!request.sessionUser) return null;
    return getMeSummary(request.sessionUser);
  });
};
