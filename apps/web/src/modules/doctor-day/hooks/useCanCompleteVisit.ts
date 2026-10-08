import { useEffect, useState } from 'react';

import type { DoctorVisitStatus } from '@/modules/doctor-day/types';

/** Complete is allowed only at/after visit start (Upcoming). Auto-enables when the clock reaches start. */
export const useCanCompleteVisit = (startsAt: string, status: DoctorVisitStatus): boolean => {
  const startMs = Date.parse(startsAt);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (status !== 'upcoming' || Number.isNaN(startMs)) {
      return;
    }
    if (nowMs >= startMs) {
      return;
    }
    const delay = Math.min(startMs - nowMs, 2_147_483_647);
    const id = window.setTimeout(() => setNowMs(Date.now()), delay);
    return () => window.clearTimeout(id);
  }, [startsAt, status, startMs, nowMs]);

  return status === 'upcoming' && !Number.isNaN(startMs) && nowMs >= startMs;
};
