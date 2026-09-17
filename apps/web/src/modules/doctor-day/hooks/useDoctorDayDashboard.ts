import { useMemo } from 'react';

import {
  usePostCancelAppointment,
  usePostCompleteAppointment,
  usePostProposeAppointment,
} from '@/api/appointments';
import { useGetDoctorMeDashboard } from '@/api/doctors';
import {
  buildWeekStrip,
  DEMO_DOCTOR_DAY,
  mapDashboardVisit,
  mapFreeWindow,
  mapMetrics,
  mapPendingPatient,
  mapProposeSlotLabels,
} from '@/modules/doctor-day/utils/mapDashboard';

export const useDoctorDayDashboard = (date = DEMO_DOCTOR_DAY) => {
  const dashboardQuery = useGetDoctorMeDashboard({ date });
  const completeMutation = usePostCompleteAppointment();
  const cancelMutation = usePostCancelAppointment();
  const proposeMutation = usePostProposeAppointment();

  const data = dashboardQuery.data;

  const visits = useMemo(
    () => (data?.visits ?? []).map(mapDashboardVisit),
    [data?.visits],
  );

  const nextVisit = useMemo(
    () => (data?.nextVisit ? mapDashboardVisit(data.nextVisit) : null),
    [data?.nextVisit],
  );

  const freeWindows = useMemo(
    () => (data?.freeWindowsToday ?? []).map(mapFreeWindow),
    [data?.freeWindowsToday],
  );

  const pendingPatients = useMemo(
    () => (data?.pendingPatients ?? []).map(mapPendingPatient),
    [data?.pendingPatients],
  );

  const metrics = useMemo(
    () =>
      data?.metrics
        ? mapMetrics(data.metrics)
        : {
            visitsToday: 0,
            pendingDecisions: 0,
            freeHoursToday: 0,
            cancellations7d: 0,
          },
    [data?.metrics],
  );

  const proposeSlots = useMemo(
    () => mapProposeSlotLabels(data?.proposeSlots ?? []),
    [data?.proposeSlots],
  );

  const proposeSlotIsos = data?.proposeSlots ?? [];

  const weekDays = useMemo(() => buildWeekStrip(date), [date]);

  return {
    date,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    visits,
    nextVisit,
    freeWindows,
    pendingPatients,
    metrics,
    proposeSlots,
    proposeSlotIsos,
    weekDays,
    completeVisit: (id: string) => completeMutation.mutateAsync({ id }),
    cancelVisit: (id: string) => cancelMutation.mutateAsync({ id }),
    proposeVisit: (id: string, proposedStartAt: string, format?: 'offline' | 'online') =>
      proposeMutation.mutateAsync({
        id,
        body: { proposedStartAt, format },
      }),
    isMutating:
      completeMutation.isPending || cancelMutation.isPending || proposeMutation.isPending,
  };
};
