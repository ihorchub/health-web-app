import { useTranslation } from 'react-i18next';

import { getApiErrorCode } from '@/api/errors';

const KNOWN_CODES = [
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_EMAIL_TAKEN',
  'AUTH_VALIDATION_FAILED',
  'AUTH_CONSENT_REQUIRED',
  'AUTH_UNAUTHORIZED',
  'AUTH_FORBIDDEN',
  'AUTH_INVALID_TOKEN',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_REGISTRATION_NOT_FOUND',
  'AUTH_EMAIL_NOT_VERIFIED',
  'AUTH_PROFILE_INCOMPLETE',
  'AUTH_ALREADY_VERIFIED',
  'AUTH_RESEND_TOO_SOON',
  'AUTH_FORBIDDEN_STEP',
] as const;

export const useAuthApiErrorMessage = () => {
  const { t } = useTranslation('auth');

  return (error: unknown): string => {
    const code = getApiErrorCode(error);

    if (code && (KNOWN_CODES as readonly string[]).includes(code)) {
      return t(`errors.${code}`);
    }

    return t('errors.generic');
  };
};
