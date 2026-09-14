export class SlotTakenError extends Error {
  code = 'SLOT_TAKEN' as const;

  constructor() {
    super('SLOT_TAKEN');
    this.name = 'SlotTakenError';
  }
}

export const isSlotTakenError = (error: unknown): error is SlotTakenError => {
  return (
    error instanceof SlotTakenError ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'SLOT_TAKEN')
  );
};
