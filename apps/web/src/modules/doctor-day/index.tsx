import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
} from '@/modules/doctor-day/styles';
import type { DoctorDayTab, DoctorDayVisit } from '@/modules/doctor-day/types';
import { DEMO_DOCTOR_DAY } from '@/modules/doctor-day/utils/mapDashboard';
import { formatCabinetHeaderDate } from '@/modules/patient-room/utils/formatCabinetDate';

const DEMO_TODAY = new Date(`${DEMO_DOCTOR_DAY}T12:00:00+03:00`);

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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const listRef = useRef<HTMLElement | null>(null);

  const {
    visits,
    nextVisit: heroVisit,
    freeWindows,
    freeSlotIsos,
    pastVisitsMonth,
    metrics,
    weekDays,
    isLoading,
    completeVisit,
    cancelVisit,
  } = useDoctorDayDashboard(DEMO_DOCTOR_DAY);

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
      return sortedVisits.filter((visit) => visit.status === 'cancelled');
    }
    if (tab === 'free') {
      return [];
    }
    return activeDayVisits;
  }, [activeDayVisits, sortedPastMonth, sortedVisits, tab]);

  const tabCounts: Record<DoctorDayTab, number> = {
    visits: metrics.visitsToday,
    past: metrics.pastVisitsMonth,
    free: metrics.freeHoursToday,
    cancellations: metrics.cancellations7d,
  };

  const shown = filteredVisits.slice(0, visibleCount);

  const listTitle =
    tab === 'past' ? t('tabs.past') : tab === 'cancellations' ? t('tabs.cancellations') : t('list.visitsTitle');

  const listMeta = isLoading
    ? t('list.loading')
    : tab === 'past'
      ? t('list.pastMonthMeta', {
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
                <EmptyBlock>
                  <strong>{t('empty.title')}</strong>
                  <p>{t('empty.body')}</p>
                </EmptyBlock>
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
              onOpenSchedule={() => {
                setScheduleOpen(true);
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
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
        }}
        visits={sortedVisits}
        freeSlotIsos={freeSlotIsos}
        onOpenVisit={(visit) => {
          setDetailVisit(visit);
        }}
      />
    </Page>
  );
};

/** @deprecated use DoctorDayPage */
export const DoctorDayStubPage = DoctorDayPage;
