import { useMemo } from 'react';

import { useGetPatientCabinet } from '@/api/patients';
import type { CabinetAppointment, CabinetDoctorCard } from '@/modules/patient-room/types';
import {
  mapCabinetAppointment,
  mapCabinetDoctorCard,
} from '@/modules/patient-room/utils/mapCabinet';

const isUpcomingGroup = (status: CabinetAppointment['status']) =>
  status === 'upcoming' || status === 'reschedule_pending';

export const useCabinetAppointmentsState = (options: { enabled?: boolean } = {}) => {
  const cabinetQuery = useGetPatientCabinet({ enabled: options.enabled ?? true });

  const appointments = useMemo(() => {
    if (!cabinetQuery.data) {
      return [] as CabinetAppointment[];
    }
    return [
      ...cabinetQuery.data.upcoming.map(mapCabinetAppointment),
      ...cabinetQuery.data.past.map(mapCabinetAppointment),
    ];
  }, [cabinetQuery.data]);

  const favourites = useMemo(
    (): CabinetDoctorCard[] =>
      (cabinetQuery.data?.favourites ?? []).map(mapCabinetDoctorCard),
    [cabinetQuery.data?.favourites],
  );

  const recentlyViewed = useMemo(
    (): CabinetDoctorCard[] =>
      (cabinetQuery.data?.recentlyViewed ?? []).map(mapCabinetDoctorCard),
    [cabinetQuery.data?.recentlyViewed],
  );

  const miniCalendar = cabinetQuery.data?.miniCalendar ?? [];
  const pendingBanner = cabinetQuery.data?.pendingBanner
    ? mapCabinetAppointment(cabinetQuery.data.pendingBanner)
    : null;
  const nextAppointment = cabinetQuery.data?.nextAppointment
    ? mapCabinetAppointment(cabinetQuery.data.nextAppointment)
    : null;
  const myReviews = cabinetQuery.data?.myReviews ?? { leftCount: 0, pendingCount: 0 };

  return {
    appointments,
    favourites,
    recentlyViewed,
    miniCalendar,
    pendingBanner,
    nextAppointment,
    myReviews,
    zoneA: cabinetQuery.data?.zoneA,
    upcomingLoading: cabinetQuery.isLoading,
    isError: cabinetQuery.isError,
    refetch: cabinetQuery.refetch,
    isUpcomingGroup,
  };
};
