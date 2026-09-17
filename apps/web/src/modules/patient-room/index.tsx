import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { DoctorSearchCard } from '@/api/doctors';
import { useGetReferenceCities } from '@/api/reference';
import { useAppRole } from '@/hooks/useAppRole';
import { cityNameMap, useClinicNamesByCityIds } from '@/hooks/useClinicNamesByCityIds';
import { usePopups } from '@/hooks/usePopups';
import { AppointmentRow } from '@/modules/patient-room/components/AppointmentRow';
import { CalendarDayDialog } from '@/modules/patient-room/components/CalendarDayDialog';
import { CabinetSidebar } from '@/modules/patient-room/components/CabinetSidebar';
import { CabinetSpecialties } from '@/modules/patient-room/components/CabinetSpecialties';
import { CabinetStatePanel } from '@/modules/patient-room/components/CabinetStatePanel';
import { DoctorCarouselSection } from '@/modules/patient-room/components/DoctorCarouselSection';
import { PendingDecisionBanner } from '@/modules/patient-room/components/PendingDecisionBanner';
import { ReschedulePendingDialog } from '@/modules/patient-room/components/ReschedulePendingDialog';
import { NextVisitHero } from '@/modules/patient-room/components/NextVisitHero';
import { VisitDetailDialog } from '@/modules/patient-room/components/VisitDetailDialog';
import {
  getFavouriteDoctors,
  getPromoDoctor,
  getRecentDoctors,
} from '@/modules/patient-room/fixtures';
import { useCabinetAppointmentsState } from '@/modules/patient-room/hooks/useCabinetAppointmentsState';
import {
  Content,
  DateLine,
  EmptyBlock,
  EmptyBody,
  EmptyTitle,
  GreetingCopy,
  GreetingRow,
  GreetingTitle,
  LayoutRow,
  LoadingSubtitle,
  MainColumn,
  Page,
  SectionHead,
  SectionMeta,
  SectionTitle,
  ShowMoreLink,
  SideColumn,
} from '@/modules/patient-room/styles';
import { WriteReviewDialog } from '@/modules/patient-room/components/WriteReviewDialog';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import {
  PENDING_RESCHEDULE_RESOLVED,
  type PendingRescheduleResolvedDetail,
  storePendingReschedulePick,
} from '@/modules/patient-room/utils/pendingRescheduleEvents';
import { formatCabinetHeaderDate } from '@/modules/patient-room/utils/formatCabinetDate';
import { Popups } from '@/utils/popupUtils/popupTypes';
import { AppRoute, doctorProfilePath } from '@/utils/routeUtils/routes';

const DEMO_TODAY = new Date('2026-08-27T12:00:00+03:00');

const isUpcomingGroup = (status: CabinetAppointment['status']) =>
  status === 'upcoming' || status === 'reschedule_pending';

export const PatientCabinetPage = () => {
  const { t, i18n } = useTranslation('cabinet');
  const navigate = useNavigate();
  const { updatePopup } = usePopups();
  const { me } = useAppRole();

  const { appointments, setAppointments, upcomingLoading } = useCabinetAppointmentsState();
  const [recentDoctors, setRecentDoctors] = useState(getRecentDoctors());
  const [detailVisit, setDetailVisit] = useState<CabinetAppointment | null>(null);
  const [reviewVisitId, setReviewVisitId] = useState<string | null>(null);
  const [calendarDayYmd, setCalendarDayYmd] = useState<string | null>(null);
  const [pendingDecisionVisit, setPendingDecisionVisit] = useState<CabinetAppointment | null>(
    null,
  );

  const citiesQuery = useGetReferenceCities();
  const cityNames = useMemo(
    () => cityNameMap(citiesQuery.data?.items ?? []),
    [citiesQuery.data?.items],
  );

  const clinicCityIds = useMemo(() => {
    const ids = new Set<string>();
    [...getFavouriteDoctors(), ...recentDoctors].forEach((doctor) => {
      ids.add(doctor.cityId);
    });
    return [...ids];
  }, [recentDoctors]);

  const clinicNames = useClinicNamesByCityIds(clinicCityIds);

  const patientName = me?.firstName ?? 'Оксана';
  const headerDate = formatCabinetHeaderDate(DEMO_TODAY, i18n.language);

  const upcoming = useMemo(
    () =>
      [...appointments.filter((item) => isUpcomingGroup(item.status))].sort((a, b) => {
        if (a.status === 'reschedule_pending' && b.status !== 'reschedule_pending') {
          return -1;
        }
        if (b.status === 'reschedule_pending' && a.status !== 'reschedule_pending') {
          return 1;
        }
        return a.startsAt.localeCompare(b.startsAt);
      }),
    [appointments],
  );
  const pendingVisits = upcoming.filter((item) => item.status === 'reschedule_pending');
  const past = appointments.filter((item) => !isUpcomingGroup(item.status));
  const nextVisit = upcoming[0] ?? null;
  const listUpcoming = upcoming.slice(1, 3);
  const promoDoctor = getPromoDoctor();
  const isEmptyAll = !upcomingLoading && appointments.length === 0;
  const showPastSection = !isEmptyAll;

  const goFindDoctor = () => {
    void navigate(AppRoute.HOME);
  };

  const openPendingDecision = (visit: CabinetAppointment) => {
    setPendingDecisionVisit(visit);
  };

  const closePendingDecision = () => {
    setPendingDecisionVisit(null);
  };

  const handleAcceptProposal = (visit: CabinetAppointment) => {
    if (!visit.proposedStartsAt) {
      return;
    }
    setAppointments((current) => {
      const rescheduled = current.map((item) =>
        item.id === visit.id
          ? { ...item, status: 'rescheduled' as const, proposedStartsAt: undefined }
          : item,
      );
      return [
        ...rescheduled,
        {
          ...visit,
          id: `${visit.id}_accepted`,
          startsAt: visit.proposedStartsAt!,
          status: 'upcoming' as const,
          proposedStartsAt: undefined,
        },
      ];
    });
    closePendingDecision();
    toast.success(t('pendingDecision.acceptedToast'));
  };

  const handleCancelPending = (visit: CabinetAppointment) => {
    setAppointments((current) =>
      current.map((item) =>
        item.id === visit.id
          ? {
              ...item,
              status: 'cancelled' as const,
              cancelledBy: 'patient' as const,
              proposedStartsAt: undefined,
            }
          : item,
      ),
    );
    closePendingDecision();
    toast.success(t('pendingDecision.cancelledToast'));
  };

  const handlePickAnother = (visit: CabinetAppointment) => {
    storePendingReschedulePick(visit.id);
    closePendingDecision();
    void navigate(doctorProfilePath(visit.doctorId));
    updatePopup(Popups.DOCTOR_PROFILE, true, {
      doctorId: visit.doctorId,
      initialStep: 'calendar',
    });
    toast.message(t('pendingDecision.pickAnotherToast'));
  };

  useEffect(() => {
    const onResolved = (event: Event) => {
      const detail = (event as CustomEvent<PendingRescheduleResolvedDetail>).detail;
      setAppointments((current) => {
        const withoutPending = current.map((item) =>
          item.id === detail.pendingId
            ? { ...item, status: 'rescheduled' as const, proposedStartsAt: undefined }
            : item,
        );
        return [
          ...withoutPending,
          {
            id: `${detail.pendingId}_picked`,
            doctorId: detail.doctorId,
            startsAt: detail.newStartsAt,
            durationMinutes: detail.durationMinutes,
            status: 'upcoming' as const,
            format: detail.format,
          },
        ];
      });
      toast.success(t('pendingDecision.acceptedToast'));
    };

    window.addEventListener(PENDING_RESCHEDULE_RESOLVED, onResolved);
    return () => {
      window.removeEventListener(PENDING_RESCHEDULE_RESOLVED, onResolved);
    };
  }, [t]);

  const openDoctor = (doctor: DoctorSearchCard) => {
    void navigate(doctorProfilePath(doctor.id));
    updatePopup(Popups.DOCTOR_PROFILE, true, { doctorId: doctor.id });
  };

  const handleSubmitReview = (rating: number) => {
    if (!reviewVisitId) {
      return;
    }

    setAppointments((current) =>
      current.map((item) =>
        item.id === reviewVisitId
          ? { ...item, hasPatientReview: true, patientReviewRating: rating }
          : item,
      ),
    );
    toast.success(t('past.leaveReview'));
  };

  return (
    <Page>
      <Content>
        <GreetingRow>
          <GreetingCopy>
            <GreetingTitle>{t('greeting', { name: patientName })}</GreetingTitle>
            {upcomingLoading ? (
              <LoadingSubtitle>{t('page.loadingSubtitle')}</LoadingSubtitle>
            ) : null}
          </GreetingCopy>
          <DateLine>{t('dateLine', { date: headerDate })}</DateLine>
        </GreetingRow>

        <LayoutRow>
          <MainColumn>
            {!upcomingLoading && pendingVisits.length > 0 ? (
              <PendingDecisionBanner
                count={pendingVisits.length}
                onOpen={() => {
                  openPendingDecision(pendingVisits[0]!);
                }}
              />
            ) : null}

            {!upcomingLoading && nextVisit ? (
              <NextVisitHero
                appointment={nextVisit}
                onOpen={() => {
                  if (nextVisit.status === 'reschedule_pending') {
                    openPendingDecision(nextVisit);
                    return;
                  }
                  setDetailVisit(nextVisit);
                }}
                onDecide={() => {
                  openPendingDecision(nextVisit);
                }}
                onReschedule={() => {
                  toast.message(t('nextVisit.move'));
                }}
                onCancel={() => {
                  toast.message(t('nextVisit.cancel'));
                }}
              />
            ) : null}

            <section>
              <SectionHead>
                <SectionTitle>{t('upcoming.title')}</SectionTitle>
                <SectionMeta>
                  {upcomingLoading
                    ? t('upcoming.loadingCount')
                    : t('upcoming.count', { count: upcoming.length })}
                </SectionMeta>
              </SectionHead>

              {upcomingLoading ? (
                <CabinetStatePanel variant="loading" />
              ) : listUpcoming.length > 0 ? (
                listUpcoming.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    appointment={item}
                    variant="upcoming"
                    onOpen={() => {
                      if (item.status === 'reschedule_pending') {
                        openPendingDecision(item);
                        return;
                      }
                      setDetailVisit(item);
                    }}
                    onDecide={() => {
                      openPendingDecision(item);
                    }}
                    onReschedule={() => {
                      toast.message(t('nextVisit.move'));
                    }}
                    onCancel={() => {
                      toast.message(t('nextVisit.cancel'));
                    }}
                  />
                ))
              ) : isEmptyAll ? (
                <CabinetStatePanel variant="empty-all" onFindDoctor={goFindDoctor} />
              ) : (
                <CabinetStatePanel variant="empty-upcoming" onFindDoctor={goFindDoctor} />
              )}

              {!upcomingLoading && upcoming.length > 3 ? (
                <ShowMoreLink type="button">{t('upcoming.showAll')}</ShowMoreLink>
              ) : null}
            </section>

            {showPastSection ? (
            <section>
              <SectionHead>
                <SectionTitle>{t('past.title')}</SectionTitle>
                <SectionMeta>{t('past.count', { count: past.length })}</SectionMeta>
              </SectionHead>

              {past.length > 0 ? (
                past.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    appointment={item}
                    variant="past"
                    onOpen={() => {
                      setDetailVisit(item);
                    }}
                    onLeaveReview={() => {
                      setReviewVisitId(item.id);
                    }}
                  />
                ))
              ) : (
                <EmptyBlock>
                  <EmptyTitle>{t('past.emptyTitle')}</EmptyTitle>
                  <EmptyBody>{t('past.emptyBody')}</EmptyBody>
                </EmptyBlock>
              )}
            </section>
            ) : null}

            <DoctorCarouselSection
              title={t('favourites.title')}
              linkLabel={t('favourites.all')}
              onLink={() => {
                void navigate(AppRoute.HOME);
              }}
              doctors={getFavouriteDoctors()}
              clinicNames={clinicNames}
              cityNames={cityNames}
              onOpenProfile={openDoctor}
              onBook={openDoctor}
              onFavourite={() => {
                toast.message(t('favourites.title'));
              }}
              onViewHours={openDoctor}
            />

            <DoctorCarouselSection
              title={t('recent.title')}
              linkLabel={t('recent.clear')}
              onLink={() => {
                setRecentDoctors([]);
              }}
              doctors={recentDoctors}
              clinicNames={clinicNames}
              cityNames={cityNames}
              onOpenProfile={openDoctor}
              onBook={openDoctor}
              onFavourite={() => undefined}
              onViewHours={openDoctor}
            />

            <CabinetSpecialties />
          </MainColumn>

          <SideColumn>
            <CabinetSidebar
              appointments={appointments}
              nextVisit={upcomingLoading ? null : nextVisit}
              promoDoctor={promoDoctor}
              onOpenVisit={() => {
                if (!nextVisit) {
                  return;
                }
                if (nextVisit.status === 'reschedule_pending') {
                  openPendingDecision(nextVisit);
                  return;
                }
                setDetailVisit(nextVisit);
              }}
              onBookPromo={() => {
                if (promoDoctor) {
                  openDoctor(promoDoctor);
                }
              }}
              onOpenDay={(ymd) => {
                setCalendarDayYmd(ymd);
              }}
            />
          </SideColumn>
        </LayoutRow>
      </Content>

      <CalendarDayDialog
        open={Boolean(calendarDayYmd)}
        initialYmd={calendarDayYmd}
        appointments={appointments}
        onClose={() => {
          setCalendarDayYmd(null);
        }}
        onOpenVisit={(visit) => {
          setCalendarDayYmd(null);
          if (visit.status === 'reschedule_pending') {
            openPendingDecision(visit);
            return;
          }
          setDetailVisit(visit);
        }}
      />

      <ReschedulePendingDialog
        appointment={pendingDecisionVisit}
        open={Boolean(pendingDecisionVisit)}
        onClose={closePendingDecision}
        onAccept={handleAcceptProposal}
        onPickAnother={handlePickAnother}
        onCancelVisit={handleCancelPending}
      />

      <VisitDetailDialog
        appointment={detailVisit}
        open={Boolean(detailVisit)}
        onClose={() => {
          setDetailVisit(null);
        }}
      />

      <WriteReviewDialog
        open={Boolean(reviewVisitId)}
        onClose={() => {
          setReviewVisitId(null);
        }}
        onSubmit={handleSubmitReview}
      />
    </Page>
  );
};

/** @deprecated use PatientCabinetPage */
export const PatientCabinetStubPage = PatientCabinetPage;
