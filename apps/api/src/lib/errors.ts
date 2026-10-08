export type ApiErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_EMAIL_TAKEN"
  | "AUTH_VALIDATION_FAILED"
  | "AUTH_CONSENT_REQUIRED"
  | "AUTH_UNAUTHORIZED"
  | "AUTH_FORBIDDEN"
  | "AUTH_INVALID_TOKEN"
  | "AUTH_TOKEN_EXPIRED"
  | "AUTH_REGISTRATION_NOT_FOUND"
  | "AUTH_EMAIL_NOT_VERIFIED"
  | "AUTH_PROFILE_INCOMPLETE"
  | "AUTH_ALREADY_VERIFIED"
  | "AUTH_RESEND_TOO_SOON"
  | "AUTH_FORBIDDEN_STEP"
  | "DOCTOR_NOT_FOUND"
  | "SEARCH_FAILED"
  | "CALENDAR_FAILED"
  | "APPOINTMENT_NOT_FOUND"
  | "APPOINTMENT_FORBIDDEN"
  | "APPOINTMENT_INVALID_TRANSITION"
  | "APPOINTMENT_TOO_EARLY_TO_COMPLETE"
  | "APPOINTMENT_PENDING_EXISTS"
  | "SLOT_TAKEN"
  | "SLOT_OUTSIDE_WINDOW"
  | "SLOT_NOT_FREE"
  | "NOTIFICATION_FORBIDDEN"
  | "NOTIFICATION_NOT_FOUND"
  | "REVIEW_ALREADY_EXISTS"
  | "REVIEW_FORBIDDEN"
  | "SCHEDULE_FORBIDDEN"
  | "SCHEDULE_ZONE_FROZEN"
  | "SCHEDULE_VALIDATION_FAILED"
  | "BULK_CANCEL_INVALID_SCOPE";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly statusCode: number,
    public readonly fields?: Record<string, string>,
    message?: string,
  ) {
    super(message ?? code);
  }
}

export function errorBody(code: ApiErrorCode, fields?: Record<string, string>, message?: string) {
  return {
    error: {
      code,
      ...(message ? { message } : {}),
      ...(fields ? { fields } : {}),
    },
  };
}
