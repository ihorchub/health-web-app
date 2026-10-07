import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useGetDoctorMeDashboard } from '@/api/doctors';
import { StateMascot } from '@/components/StateMascot/StateMascot';
import { useAppRole } from '@/hooks/useAppRole';
import {
  DayScheduleDialog,
  VisitCardDialog,
} from '@/modules/doctor-day/components/DoctorDayModals';
import { DoctorDaySidebar } from '@/modules/doctor-day/components/DoctorDaySidebar';
import { DoctorDayTabs } from '@/modules/doctor-day/components/DoctorDayTabs';
import {
  DoctorNextVisitHero,
  DoctorVisitRow,
} from '@/modules/doctor-day/components/DoctorVisitRow';
import { useDoctorDayDashboard } from '@/modules/doctor-day/hooks/useDoctorDayDashboard';
import {
  Content,
  DateLine,
  EmptyBlock,
  GreetingCopy,
  GreetingRow,
  GreetingSubtitle,
  GreetingTitle,
  LayoutRow,
  MainColumn,
  Page,
  SectionHead,
  SectionMeta,
  SectionTitle,
  ShowMore,
  SideColumn,
  VisitsEmptyBody,
  VisitsEmptyState,
  VisitsEmptyTitle,
} from '@/modules/doctor-day/styles';
import type { DoctorDayTab, DoctorDayVisit } from '@/modules/doctor-day/types';
import {
  DEMO_DOCTOR_DAY,
  mapDashboardVisit,
} from '@/modules/doctor-day/utils/mapDashboard';
import { formatCabinetHeaderDate } from '@/modules/patient-room/utils/formatCabinetDate';

const DEMO_TODAY = new Date(`${DEMO_DOCTOR_DAY}T12:00:00+03:00`);
const LIKA_EMPTY = '/brand/lika-poses/lika4.png';

const greetingKey = (hour: number) => {
  if (hour < 12) {
    return 'greetingMorning';
  }
  if (hour < 18) {
    return 'greetingDay';
  }
  return 'greetingEvening';
};

export const DoctorDayPage = () => {
  const { t, i18n } = useTranslation('doctorDay');
  const { me } = useAppRole();
  const [tab, setTab] = useState<DoctorDayTab>('visits');
  const [visibleCount, setVisibleCount] = useState(8);
  const [detailVisit, setDetailVisit] = useState<DoctorDayVisit | null>(null);
  const [scheduleDayYmd, setScheduleDayYmd] = useState<string | null>(null);
  const listRef = useRef<HTMLElement | null>(null);

  const {
    visits,
    nextVisit: heroVisit,
    freeWindows,
    pastVisitsMonth,
    cancellationsLast7Days,
    metrics,
    weekDays,
    isLoading,
    completeVisit,
    cancelVisit,
  } = useDoctorDayDashboard(DEMO_DOCTOR_DAY);

  const scheduleDayQuery = useGetDoctorMeDashboard(
    { date: scheduleDayYmd ?? DEMO_DOCTOR_DAY },
    { enabled: Boolean(scheduleDayYmd) },
  );
  const scheduleDayVisits = useMemo(
    () => (scheduleDayQuery.data?.visits ?? []).map(mapDashboardVisit),
    [scheduleDayQuery.data?.visits],
  );
  const scheduleDayFreeSlots = useMemo(
    () => [...(scheduleDayQuery.data?.freeWindowsToday ?? [])].sort(),
    [scheduleDayQuery.data?.freeWindowsToday],
  );

  const doctorName = me?.firstName ?? 'Оксано';
  const headerDate = formatCabinetHeaderDate(DEMO_TODAY, i18n.language);

  const sortedVisits = useMemo(
    () => [...visits].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [visits],
  );

  const sortedPastMonth = useMemo(
    () => [...pastVisitsMonth].sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    [pastVisitsMonth],
  );

  const sortedCancellations = useMemo(
    () => [...cancellationsLast7Days].sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    [cancellationsLast7Days],
  );

  const isPastVisit = (visit: DoctorDayVisit) =>
    visit.status === 'completed' ||
    visit.status === 'cancelled' ||
    visit.status === 'rescheduled';

  const activeDayVisits = useMemo(
    () => sortedVisits.filter((visit) => !isPastVisit(visit)),
    [sortedVisits],
  );

  const pastDayVisits = useMemo(
    () => sortedVisits.filter((visit) => isPastVisit(visit)),
    [sortedVisits],
  );

  const filteredVisits = useMemo(() => {
    if (tab === 'past') {
      return sortedPastMonth;
    }
    if (tab === 'cancellations') {
      return sortedCancellations;
    }
    if (tab === 'free') {
      return [];
    }
    return activeDayVisits;
  }, [activeDayVisits, sortedCancellations, sortedPastMonth, tab]);

  const tabCounts: Record<DoctorDayTab, number> = {
    visits: metrics.visitsToday,
    past: metrics.pastVisitsMonth,
    free: metrics.freeHoursToday,
    cancellations: metrics.cancellations7d,
  };

  const shown = filteredVisits.slice(0, visibleCount);

  const listTitle =
    tab === 'past'
      ? t('tabs.past')
      : tab === 'cancellations'
        ? t('tabs.cancellations')
        : t('list.visitsTitle');

  const listMeta = isLoading
    ? t('list.loading')
    : tab === 'past'
      ? t('list.pastMonthMetaShown', {
          total: filteredVisits.length,
          shown: shown.length,
        })
      : tab === 'cancellations'
        ? t('list.cancellationsMeta', {
            total: filteredVisits.length,
            shown: shown.length,
          })
        : t('list.visitsMeta', {
            total: filteredVisits.length,
            shown: shown.length,
          });

  const markCompleted = async (id: string) => {
    try {
      await completeVisit(id);
      toast.success(t('rowActions.completeSuccess'));
    } catch {
      toast.error(t('rowActions.completeError'));
    }
  };

  const cancelOne = async (id: string) => {
    try {
      await cancelVisit(id);
      toast.success(t('rowActions.cancelSuccess'));
    } catch {
      toast.error(t('rowActions.cancelError'));
    }
  };

  return (
    <Page>
      <Content>
        <GreetingRow>
          <GreetingCopy>
            <GreetingTitle>
              {t(greetingKey(DEMO_TODAY.getHours()), { name: doctorName })}
            </GreetingTitle>
            <GreetingSubtitle>{t('subtitle')}</GreetingSubtitle>
          </GreetingCopy>
          <DateLine>{t('dateLine', { date: headerDate })}</DateLine>
        </GreetingRow>

        {heroVisit ? (
          <DoctorNextVisitHero
            visit={heroVisit}
            onOpen={() => {
              setDetailVisit(heroVisit);
            }}
            onComplete={() => {
              void markCompleted(heroVisit.id);
            }}
            onCancel={() => {
              void cancelOne(heroVisit.id);
            }}
          />
        ) : null}

        <LayoutRow>
          <MainColumn>
            <DoctorDayTabs
              active={tab}
              counts={tabCounts}
              onChange={(next) => {
                setTab(next);
                setVisibleCount(8);
              }}
            />

            <section ref={listRef}>
              <SectionHead>
                <SectionTitle>{listTitle}</SectionTitle>
                <SectionMeta>{listMeta}</SectionMeta>
              </SectionHead>

              {tab === 'free' ? (
                freeWindows.map((window) => (
                  <EmptyBlock key={window.id}>
                    {window.start}–{window.end} · {window.slotsCount}
                  </EmptyBlock>
                ))
              ) : shown.length > 0 || (tab === 'visits' && pastDayVisits.length > 0) ? (
                <>
                  {shown.map((visit) => (
                    <DoctorVisitRow
                      key={visit.id}
                      visit={visit}
                      showDate={tab === 'past' || tab === 'cancellations'}
                      onOpen={() => {
                        setDetailVisit(visit);
                      }}
                      onComplete={
                        visit.status === 'upcoming'
                          ? () => {
                              void markCompleted(visit.id);
                            }
                          : undefined
                      }
                      onCancel={
                        visit.status === 'upcoming'
                          ? () => {
                              void cancelOne(visit.id);
                            }
                          : undefined
                      }
                    />
                  ))}

                  {tab === 'visits' && pastDayVisits.length > 0 ? (
                    <>
                      <SectionHead>
                        <SectionTitle>{t('list.pastTitle')}</SectionTitle>
                        <SectionMeta>
                          {t('list.pastMeta', { total: pastDayVisits.length })}
                        </SectionMeta>
                      </SectionHead>
                      {pastDayVisits.map((visit) => (
                        <DoctorVisitRow
                          key={visit.id}
                          visit={visit}
                          onOpen={() => {
                            setDetailVisit(visit);
                          }}
                        />
                      ))}
                    </>
                  ) : null}
                </>
              ) : (
                <VisitsEmptyState>
                  <StateMascot src={LIKA_EMPTY} size={96} />
                  <VisitsEmptyTitle>{t('empty.title')}</VisitsEmptyTitle>
                  <VisitsEmptyBody>{t('empty.body')}</VisitsEmptyBody>
                </VisitsEmptyState>
              )}

              {filteredVisits.length > visibleCount ? (
                <ShowMore
                  type="button"
                  onClick={() => {
                    setVisibleCount((count) => count + 4);
                  }}
                >
                  {t('list.showMore')}
                </ShowMore>
              ) : null}
            </section>
          </MainColumn>

          <SideColumn>
            <DoctorDaySidebar
              nextVisit={heroVisit ?? null}
              weekDays={weekDays}
              freeWindows={freeWindows}
              onSelectDay={(ymd) => {
                setScheduleDayYmd(ymd);
              }}
              onOpenVisit={() => {
                if (heroVisit) {
                  setDetailVisit(heroVisit);
                }
              }}
            />
          </SideColumn>
        </LayoutRow>
      </Content>

      <VisitCardDialog
        visit={detailVisit}
        open={Boolean(detailVisit)}
        onClose={() => {
          setDetailVisit(null);
        }}
        onComplete={() => {
          if (detailVisit) {
            void markCompleted(detailVisit.id);
          }
        }}
        onCancel={() => {
          if (detailVisit) {
            void cancelOne(detailVisit.id);
          }
        }}
      />

      <DayScheduleDialog
        open={Boolean(scheduleDayYmd)}
        dateYmd={scheduleDayYmd}
        isLoading={scheduleDayQuery.isLoading || scheduleDayQuery.isFetching}
        onClose={() => {
          setScheduleDayYmd(null);
        }}
        visits={scheduleDayVisits}
        freeSlotIsos={scheduleDayFreeSlots}
        onOpenVisit={(visit) => {
          setDetailVisit(visit);
        }}
      />
    </Page>
  );
};

/** @deprecated use DoctorDayPage */
export const DoctorDayStubPage = DoctorDayPage;
