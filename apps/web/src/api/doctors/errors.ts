import { getApiErrorCode } from '@/api/errors';

export class DoctorNotFoundError extends Error {
  code = 'DOCTOR_NOT_FOUND' as const;

  constructor() {
    super('DOCTOR_NOT_FOUND');
    this.name = 'DoctorNotFoundError';
  }
}

export const isDoctorNotFoundError = (error: unknown): boolean => {
  if (error instanceof DoctorNotFoundError) {
    return true;
  }
  if (getApiErrorCode(error) === 'DOCTOR_NOT_FOUND') {
    return true;
  }
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'DOCTOR_NOT_FOUND'
  );
};
