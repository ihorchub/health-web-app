import Axios from 'axios';

export type ApiErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_TAKEN'
  | 'AUTH_VALIDATION_FAILED'
  | 'AUTH_CONSENT_REQUIRED'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_REGISTRATION_NOT_FOUND'
  | 'AUTH_EMAIL_NOT_VERIFIED'
  | 'AUTH_PROFILE_INCOMPLETE'
  | 'AUTH_ALREADY_VERIFIED'
  | 'AUTH_RESEND_TOO_SOON'
  | 'AUTH_FORBIDDEN_STEP';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode | string;
    message?: string;
    fields?: Record<string, string>;
  };
}

export const getApiErrorCode = (error: unknown): string | null => {
  if (!Axios.isAxiosError<ApiErrorBody>(error)) {
    return null;
  }

  return error.response?.data?.error?.code ?? null;
};

export const getApiErrorFields = (error: unknown): Record<string, string> | null => {
  if (!Axios.isAxiosError<ApiErrorBody>(error)) {
    return null;
  }

  return error.response?.data?.error?.fields ?? null;
};
