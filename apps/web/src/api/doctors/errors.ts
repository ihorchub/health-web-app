export class DoctorNotFoundError extends Error {
  code = 'DOCTOR_NOT_FOUND' as const;

  constructor() {
    super('DOCTOR_NOT_FOUND');
    this.name = 'DoctorNotFoundError';
  }
}

export const isDoctorNotFoundError = (error: unknown): error is DoctorNotFoundError => {
  return (
    error instanceof DoctorNotFoundError ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'DOCTOR_NOT_FOUND')
  );
};
