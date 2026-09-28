export class SlotTakenError extends Error {
  code = 'SLOT_TAKEN' as const;

  constructor() {
    super('SLOT_TAKEN');
    this.name = 'SlotTakenError';
  }
}

export class AppointmentForbiddenError extends Error {
  code = 'APPOINTMENT_FORBIDDEN' as const;

  constructor() {
    super('APPOINTMENT_FORBIDDEN');
    this.name = 'AppointmentForbiddenError';
  }
}

export class AppointmentInvalidTransitionError extends Error {
  code = 'APPOINTMENT_INVALID_TRANSITION' as const;

  constructor() {
    super('APPOINTMENT_INVALID_TRANSITION');
    this.name = 'AppointmentInvalidTransitionError';
  }
}

export class SlotNotFreeError extends Error {
  code = 'SLOT_NOT_FREE' as const;

  constructor() {
    super('SLOT_NOT_FREE');
    this.name = 'SlotNotFreeError';
  }
}

import { getApiErrorCode } from '@/api/errors';

export const isSlotTakenError = (error: unknown): error is SlotTakenError => {
  if (error instanceof SlotTakenError) {
    return true;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'SLOT_TAKEN'
  ) {
    return true;
  }
  return getApiErrorCode(error) === 'SLOT_TAKEN';
};
