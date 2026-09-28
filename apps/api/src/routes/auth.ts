import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { SPECIALTY_IDS, type SpecialtyId } from "../constants/specialties.js";
import { ApiError } from "../lib/errors.js";
import { saveLicenseFile } from "../lib/uploads.js";
import {
  AuthSessionResponse,
  MeResponseNullable,
  OkTrue,
  RegisterStep1Response,
  RegisterStep3Response,
  RegistrationStatusResponse,
  ResendEmailResponse,
  VerifyEmailResponse,
} from "../openapi/schemas.js";
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
const Specialty = Type.Union(SPECIALTY_IDS.map((id) => Type.Literal(id)));

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/api/v1/auth/register/step-1",
    {
      schema: {
        tags: ["auth"],
        operationId: "postAuthRegisterStep1",
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
        response: { 200: RegisterStep1Response },
      },
    },
    async (request) => {
      return registerStep1(request.body as Parameters<typeof registerStep1>[0], request.log);
    },
  );

  app.get(
    "/api/v1/auth/register/:registrationId/status",
    {
      schema: {
        tags: ["auth"],
        operationId: "getAuthRegisterStatus",
        params: Type.Object({ registrationId: Type.String() }),
        response: { 200: RegistrationStatusResponse },
      },
    },
    async (request) => {
      const { registrationId } = request.params as { registrationId: string };
      return getRegistrationStatus(registrationId);
    },
  );

  app.post(
    "/api/v1/auth/register/verify-email",
    {
      schema: {
        tags: ["auth"],
        operationId: "postAuthRegisterVerifyEmail",
        body: Type.Object({
          registrationId: Type.String(),
          token: Type.String(),
        }),
        response: { 200: VerifyEmailResponse },
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
        tags: ["auth"],
        operationId: "postAuthRegisterResendEmail",
        body: Type.Object({ registrationId: Type.String() }),
        response: { 200: ResendEmailResponse },
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
        tags: ["auth"],
        operationId: "postAuthRegisterStep3Patient",
        body: Type.Object({
          registrationId: Type.String(),
          dob: Type.String(),
          gender: Type.Union([Type.Literal("female"), Type.Literal("male")]),
          cityId: Type.String(),
          clinicId: Type.String(),
        }),
        response: { 200: RegisterStep3Response },
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

  app.post(
    "/api/v1/auth/register/step-3/doctor",
    {
      schema: {
        tags: ["auth"],
        operationId: "postAuthRegisterStep3Doctor",
        response: { 200: RegisterStep3Response },
      },
    },
    async (request) => {
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
      const specialty = fields.specialty as SpecialtyId | undefined;
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
    },
  );

  /** @deprecated Prefer step-3/patient or step-3/doctor */
  app.post(
    "/api/v1/auth/register/step-3",
    {
      schema: {
        tags: ["auth"],
        operationId: "postAuthRegisterStep3",
        body: Type.Object({
          registrationId: Type.String(),
          dob: Type.String(),
          gender: Type.Optional(Type.Union([Type.Literal("female"), Type.Literal("male")])),
          cityId: Type.String(),
          clinicId: Type.String(),
          specialty: Type.Optional(Specialty),
          yearsPractice: Type.Optional(Type.Number()),
          visitDurationMinutes: Type.Optional(
            Type.Union([Type.Literal(20), Type.Literal(30), Type.Literal(45)]),
          ),
        }),
        response: { 200: RegisterStep3Response },
      },
    },
    async (request) => {
      const body = request.body as {
        registrationId: string;
        dob: string;
        gender?: "female" | "male";
        cityId: string;
        clinicId: string;
        specialty?: SpecialtyId;
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
        tags: ["auth"],
        operationId: "postAuthRegisterComplete",
        body: Type.Object({ registrationId: Type.String() }),
        response: { 200: AuthSessionResponse },
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
        tags: ["auth"],
        operationId: "postAuthLogin",
        body: Type.Object({
          email: Type.String(),
          password: Type.String(),
        }),
        response: { 200: AuthSessionResponse },
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

  app.post(
    "/api/v1/auth/logout",
    {
      schema: {
        tags: ["auth"],
        operationId: "postAuthLogout",
        response: { 200: OkTrue },
      },
    },
    async (request, reply) => {
      const raw = request.cookies[SESSION_COOKIE];
      if (raw) {
        const unsigned = request.unsignCookie(raw);
        if (unsigned.valid && unsigned.value) {
          await destroySession(unsigned.value);
        }
      }
      clearSessionCookie(reply);
      return { ok: true };
    },
  );

  app.get(
    "/api/v1/auth/me",
    {
      schema: {
        tags: ["auth"],
        operationId: "getAuthMe",
        response: { 200: MeResponseNullable },
      },
    },
    async (request) => {
      if (!request.sessionUser) return null;
      return getMeSummary(request.sessionUser);
    },
  );
};
