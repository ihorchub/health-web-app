import { useEffect, useMemo, useRef, useState } from 'react';
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
  MobileOnlyStack,
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
import {
  formatCabinetHeaderDate,
  isTodayOrTomorrow,
} from '@/modules/patient-room/utils/formatCabinetDate';
import { Popups } from '@/utils/popupUtils/popupTypes';
import { AppRoute, doctorProfilePath } from '@/utils/routeUtils/routes';

const DEMO_TODAY = new Date('2026-08-27T12:00:00+03:00');
const UPCOMING_PREVIEW = 2;

const isUpcomingGroup = (status: CabinetAppointment['status']) =>
  status === 'upcoming' || status === 'reschedule_pending';

export const PatientCabinetPage = () => {
  const { t, i18n } = useTranslation('cabinet');
  const navigate = useNavigate();
  const { updatePopup } = usePopups();
  const { me } = useAppRole();
  const pastSectionRef = useRef<HTMLElement | null>(null);

  const { appointments, setAppointments, upcomingLoading } = useCabinetAppointmentsState();
  const [recentDoctors, setRecentDoctors] = useState(getRecentDoctors());
  const [detailVisit, setDetailVisit] = useState<CabinetAppointment | null>(null);
  const [reviewVisitId, setReviewVisitId] = useState<string | null>(null);
  const [calendarDayYmd, setCalendarDayYmd] = useState<string | null>(null);
  const [pendingDecisionVisit, setPendingDecisionVisit] = useState<CabinetAppointment | null>(
    null,
  );
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

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
  const restUpcoming = upcoming.slice(1);
  const listUpcoming = showAllUpcoming
    ? restUpcoming
    : restUpcoming.slice(0, UPCOMING_PREVIEW);
  const promoDoctor = getPromoDoctor();
  const isEmptyAll = !upcomingLoading && appointments.length === 0;
  const showPastSection = !isEmptyAll;
  const showDoctorCarousels = !isEmptyAll;
  const showCalendar = !isEmptyAll;

  const reviewVisit = useMemo(
    () => appointments.find((item) => item.id === reviewVisitId) ?? null,
    [appointments, reviewVisitId],
  );

  const reminderVisit =
    nextVisit &&
    nextVisit.status === 'upcoming' &&
    isTodayOrTomorrow(nextVisit.startsAt, DEMO_TODAY)
      ? nextVisit
      : null;

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

  const handleCancelVisit = (visit: CabinetAppointment) => {
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
    setDetailVisit(null);
    closePendingDecision();
    toast.success(t('pendingDecision.cancelledToast'));
  };

  const handleMoveVisit = (visit: CabinetAppointment) => {
    setDetailVisit(null);
    void navigate(doctorProfilePath(visit.doctorId));
    updatePopup(Popups.DOCTOR_PROFILE, true, {
      doctorId: visit.doctorId,
      initialStep: 'calendar',
    });
    toast.message(t('pendingDecision.pickAnotherToast'));
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
  }, [setAppointments, t]);

  const openDoctor = (doctor: DoctorSearchCard) => {
    void navigate(doctorProfilePath(doctor.id));
    updatePopup(Popups.DOCTOR_PROFILE, true, { doctorId: doctor.id });
  };

  const openVisitDetail = (visit: CabinetAppointment) => {
    if (visit.status === 'reschedule_pending') {
      openPendingDecision(visit);
      return;
    }
    setDetailVisit(visit);
  };

  const handleSubmitReview = (rating: number, text: string) => {
    if (!reviewVisitId) {
      return;
    }

    setAppointments((current) =>
      current.map((item) =>
        item.id === reviewVisitId
          ? {
              ...item,
              hasPatientReview: true,
              patientReviewRating: rating,
              patientReviewText: text.trim() || undefined,
            }
          : item,
      ),
    );
    toast.success(t('reviewModal.successToast'));
  };

  const sidebarOpenVisit = () => {
    if (!nextVisit) {
      return;
    }
    openVisitDetail(nextVisit);
  };

  const sidebarBookPromo = () => {
    if (promoDoctor) {
      openDoctor(promoDoctor);
    }
  };

  const sidebarOpenDay = (ymd: string) => {
    setCalendarDayYmd(ymd);
  };

  return (
    <Page>
      <Content>
        <GreetingRow>
          <GreetingCopy>
            <GreetingTitle>
              {isEmptyAll
                ? t('emptyAll.pageTitle')
                : t('greeting', { name: patientName })}
            </GreetingTitle>
            {upcomingLoading ? (
              <LoadingSubtitle>{t('page.loadingSubtitle')}</LoadingSubtitle>
            ) : isEmptyAll ? (
              <LoadingSubtitle>{t('emptyAll.subtitle')}</LoadingSubtitle>
            ) : null}
          </GreetingCopy>
          <DateLine>{t('dateLine', { date: headerDate })}</DateLine>
        </GreetingRow>

        {!upcomingLoading && pendingVisits.length > 0 ? (
          <PendingDecisionBanner
            count={pendingVisits.length}
            onOpen={() => {
              openPendingDecision(pendingVisits[0]!);
            }}
          />
        ) : null}

        <MobileOnlyStack>
          <CabinetSidebar
            variant="mobile-early"
            appointments={appointments}
            reminderVisit={isEmptyAll ? null : reminderVisit}
            promoDoctor={promoDoctor}
            showCalendar={false}
            showReviews={false}
            onOpenVisit={sidebarOpenVisit}
            onBookPromo={sidebarBookPromo}
            onOpenDay={sidebarOpenDay}
          />
        </MobileOnlyStack>

        <LayoutRow>
          <MainColumn>
            {!upcomingLoading && nextVisit ? (
              <NextVisitHero
                appointment={nextVisit}
                onOpen={() => {
                  openVisitDetail(nextVisit);
                }}
                onDecide={() => {
                  openPendingDecision(nextVisit);
                }}
                onReschedule={() => {
                  handleMoveVisit(nextVisit);
                }}
                onCancel={() => {
                  handleCancelVisit(nextVisit);
                }}
              />
            ) : null}

            {showCalendar ? (
              <MobileOnlyStack>
                <CabinetSidebar
                  variant="mobile-calendar"
                  appointments={appointments}
                  reminderVisit={null}
                  promoDoctor={null}
                  onOpenVisit={sidebarOpenVisit}
                  onBookPromo={sidebarBookPromo}
                  onOpenDay={sidebarOpenDay}
                />
              </MobileOnlyStack>
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
                      openVisitDetail(item);
                    }}
                    onDecide={() => {
                      openPendingDecision(item);
                    }}
                    onReschedule={() => {
                      handleMoveVisit(item);
                    }}
                    onCancel={() => {
                      handleCancelVisit(item);
                    }}
                  />
                ))
              ) : isEmptyAll ? (
                <CabinetStatePanel variant="empty-all" onFindDoctor={goFindDoctor} />
              ) : (
                <CabinetStatePanel variant="empty-upcoming" onFindDoctor={goFindDoctor} />
              )}

              {!upcomingLoading && restUpcoming.length > UPCOMING_PREVIEW ? (
                <ShowMoreLink
                  type="button"
                  onClick={() => {
                    setShowAllUpcoming((value) => !value);
                  }}
                >
                  {showAllUpcoming ? t('upcoming.showLess') : t('upcoming.showAll')}
                </ShowMoreLink>
              ) : null}
            </section>

            {showPastSection ? (
              <section ref={pastSectionRef}>
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

            {showDoctorCarousels ? (
              <>
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

                {recentDoctors.length > 0 ? (
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
                ) : null}
              </>
            ) : null}

            <CabinetSpecialties />
          </MainColumn>

          <SideColumn>
            <CabinetSidebar
              variant="desktop"
              appointments={appointments}
              reminderVisit={reminderVisit}
              promoDoctor={promoDoctor}
              showCalendar={showCalendar}
              showReviews={!isEmptyAll}
              onOpenVisit={sidebarOpenVisit}
              onBookPromo={sidebarBookPromo}
              onOpenDay={sidebarOpenDay}
              onViewReviews={() => {
                pastSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          openVisitDetail(visit);
        }}
      />

      <ReschedulePendingDialog
        appointment={pendingDecisionVisit}
        open={Boolean(pendingDecisionVisit)}
        onClose={closePendingDecision}
        onAccept={handleAcceptProposal}
        onPickAnother={handlePickAnother}
        onCancelVisit={handleCancelVisit}
      />

      <VisitDetailDialog
        appointment={detailVisit}
        open={Boolean(detailVisit)}
        onClose={() => {
          setDetailVisit(null);
        }}
        onReschedule={handleMoveVisit}
        onCancel={handleCancelVisit}
        onLeaveReview={(visit) => {
          setDetailVisit(null);
          setReviewVisitId(visit.id);
        }}
        onOpenDoctor={(visit) => {
          setDetailVisit(null);
          void navigate(doctorProfilePath(visit.doctorId));
          updatePopup(Popups.DOCTOR_PROFILE, true, { doctorId: visit.doctorId });
        }}
      />

      <WriteReviewDialog
        appointment={reviewVisit}
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
