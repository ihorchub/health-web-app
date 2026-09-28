import {
  usePostCancelAppointment,
  usePostCompleteAppointment,
  usePostProposeAppointment,
} from '@/api/appointments';
import { useGetDoctorMeDashboard } from '@/api/doctors';
import {
  buildWeekStrip,
  mapDashboardVisit,
  mapFreeWindowsFromSlots,
  mapMetrics,
  mapPendingPatient,
  mapProposeSlotLabels,
  todayDoctorDayYmd,
} from '@/modules/doctor-day/utils/mapDashboard';

export const useDoctorDayDashboard = (date = todayDoctorDayYmd()) => {
  const dashboardQuery = useGetDoctorMeDashboard({ date });
  const completeMutation = usePostCompleteAppointment();
  const cancelMutation = usePostCancelAppointment();
  const proposeMutation = usePostProposeAppointment();

  const data = dashboardQuery.data;

  const visits = (data?.visits ?? []).map(mapDashboardVisit);
  const nextVisit = data?.nextVisit ? mapDashboardVisit(data.nextVisit) : null;
  const freeWindows = mapFreeWindowsFromSlots(data?.freeWindowsToday ?? []);
  const pendingPatients = (data?.pendingPatients ?? []).map(mapPendingPatient);
  const metrics = data?.metrics
    ? mapMetrics(data.metrics)
    : {
        visitsToday: 0,
        pendingDecisions: 0,
        freeHoursToday: 0,
        cancellations7d: 0,
      };

  const proposeSlotIsos = data?.freeWindowsToday ?? [];
  const proposeSlots = mapProposeSlotLabels(proposeSlotIsos);
  const weekDays = buildWeekStrip(date);

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
