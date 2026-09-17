import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getCabinetFixtureAppointments,
  MOCK_CABINET_APPOINTMENTS,
} from '@/modules/patient-room/fixtures';
import type { CabinetAppointment } from '@/modules/patient-room/types';

const isUpcomingGroup = (status: CabinetAppointment['status']) =>
  status === 'upcoming' || status === 'reschedule_pending';

const UPCOMING_LOAD_MS = 720;

export type CabinetPreviewParam = 'default' | 'empty' | 'upcoming-empty' | 'loading';

export const useCabinetAppointmentsState = () => {
  const [searchParams] = useSearchParams();
  const previewParam = searchParams.get('cabinetPreview') as CabinetPreviewParam | null;

  const fixture = useMemo(
    () => getCabinetFixtureAppointments(previewParam),
    [previewParam],
  );

  const [appointments, setAppointments] = useState<CabinetAppointment[]>(() =>
    previewParam === 'loading' ? [] : fixture.filter((item) => !isUpcomingGroup(item.status)),
  );
  const [upcomingLoading, setUpcomingLoading] = useState(
    () => previewParam === 'loading' || previewParam === 'default' || previewParam === null,
  );

  useEffect(() => {
    if (previewParam === 'loading') {
      setUpcomingLoading(true);
      setAppointments([]);
      return undefined;
    }

    const past = fixture.filter((item) => !isUpcomingGroup(item.status));
    const upcoming = fixture.filter((item) => isUpcomingGroup(item.status));

    setAppointments(past);
    setUpcomingLoading(true);

    const delay =
      previewParam === 'empty' || previewParam === 'upcoming-empty' ? 0 : UPCOMING_LOAD_MS;

    const timer = window.setTimeout(() => {
      setAppointments([...past, ...upcoming]);
      setUpcomingLoading(false);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fixture, previewParam]);

  return {
    appointments,
    setAppointments,
    upcomingLoading,
    previewParam,
    resetToDefaultFixture: () => MOCK_CABINET_APPOINTMENTS,
  };
};
