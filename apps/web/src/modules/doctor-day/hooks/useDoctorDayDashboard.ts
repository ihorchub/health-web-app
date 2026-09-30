import {
  usePostCancelAppointment,
  usePostCompleteAppointment,
} from '@/api/appointments';
import { useGetDoctorMeDashboard } from '@/api/doctors';
import {
  buildWeekStrip,
  mapDashboardVisit,
  mapFreeWindowsFromSlots,
  mapMetrics,
  todayDoctorDayYmd,
} from '@/modules/doctor-day/utils/mapDashboard';

export const useDoctorDayDashboard = (date = todayDoctorDayYmd()) => {
  const dashboardQuery = useGetDoctorMeDashboard({ date });
  const completeMutation = usePostCompleteAppointment();
  const cancelMutation = usePostCancelAppointment();

  const data = dashboardQuery.data;

  const visits = (data?.visits ?? []).map(mapDashboardVisit);
  const nextVisit = data?.nextVisit ? mapDashboardVisit(data.nextVisit) : null;
  const freeWindows = mapFreeWindowsFromSlots(data?.freeWindowsToday ?? []);
  const freeSlotIsos = [...(data?.freeWindowsToday ?? [])].sort();
  const pastVisitsMonth = (data?.pastVisitsMonth ?? []).map(mapDashboardVisit);
  const metrics = data?.metrics
    ? mapMetrics(data.metrics)
    : {
        visitsToday: 0,
        freeHoursToday: 0,
        cancellations7d: 0,
        pastVisitsMonth: 0,
      };

  const weekDays = buildWeekStrip(date, data?.weekStrip ?? []);

  return {
    date,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    visits,
    nextVisit,
    freeWindows,
    freeSlotIsos,
    pastVisitsMonth,
    metrics,
    weekDays,
    completeVisit: (id: string) => completeMutation.mutateAsync({ id }),
    cancelVisit: (id: string) => cancelMutation.mutateAsync({ id }),
    isMutating: completeMutation.isPending || cancelMutation.isPending,
  };
};
