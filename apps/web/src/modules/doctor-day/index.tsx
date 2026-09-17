import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAppRole } from '@/hooks/useAppRole';
import {
  DayScheduleDialog,
  ProposeTimeDialog,
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
  const [proposeVisit, setProposeVisit] = useState<DoctorDayVisit | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const {
    visits,
    nextVisit: heroVisit,
    freeWindows,
    pendingPatients,
    metrics,
    proposeSlots,
    proposeSlotIsos,
    weekDays,
    isLoading,
    completeVisit,
    cancelVisit,
    proposeVisit: submitPropose,
  } = useDoctorDayDashboard(DEMO_DOCTOR_DAY);

  const doctorName = me?.firstName ?? 'Оксано';
  const headerDate = formatCabinetHeaderDate(DEMO_TODAY, i18n.language);

  const sortedVisits = useMemo(
    () => [...visits].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [visits],
  );

  const filteredVisits = useMemo(() => {
    const withoutHero = heroVisit
      ? sortedVisits.filter((visit) => visit.id !== heroVisit.id)
      : sortedVisits;

    if (tab === 'pending') {
      return withoutHero.filter((visit) => visit.status === 'reschedule_pending');
    }
    if (tab === 'cancellations') {
      return withoutHero.filter((visit) => visit.status === 'cancelled');
    }
    if (tab === 'free') {
      return [];
    }
    return withoutHero;
  }, [heroVisit, sortedVisits, tab]);

  const tabCounts: Record<DoctorDayTab, number> = {
    visits: metrics.visitsToday,
    pending: metrics.pendingDecisions,
    free: metrics.freeHoursToday,
    cancellations: metrics.cancellations7d,
  };

  const shown = filteredVisits.slice(0, visibleCount);

  const markCompleted = async (id: string) => {
    try {
      await completeVisit(id);
      toast.success(t('rowActions.complete'));
    } catch {
      toast.error(t('rowActions.complete'));
    }
  };

  const cancelOne = async (id: string) => {
    try {
      await cancelVisit(id);
      toast.message(t('rowActions.cancel'));
    } catch {
      toast.error(t('rowActions.cancel'));
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
            onPropose={() => {
              setProposeVisit(heroVisit);
            }}
            onCancel={() => {
              void cancelOne(heroVisit.id);
            }}
          />
        ) : null}

        <LayoutRow>
          <MainColumn>
            <DoctorDayTabs active={tab} counts={tabCounts} onChange={setTab} />

            <section>
              <SectionHead>
                <SectionTitle>{t('list.visitsTitle')}</SectionTitle>
                <SectionMeta>
                  {isLoading
                    ? t('list.loading')
                    : t('list.visitsMeta', {
                        total: sortedVisits.length,
                        shown: shown.length + (tab === 'visits' && heroVisit ? 1 : 0),
                      })}
                </SectionMeta>
              </SectionHead>

              {tab === 'free' ? (
                freeWindows.map((window) => (
                  <EmptyBlock key={window.id}>
                    {window.start}–{window.end} · {window.slotsCount}
                  </EmptyBlock>
                ))
              ) : shown.length > 0 ? (
                shown.map((visit) => (
                  <DoctorVisitRow
                    key={visit.id}
                    visit={visit}
                    onOpen={() => {
                      setDetailVisit(visit);
                    }}
                    onComplete={() => {
                      void markCompleted(visit.id);
                    }}
                    onPropose={() => {
                      setProposeVisit(visit);
                    }}
                    onCancel={() => {
                      void cancelOne(visit.id);
                    }}
                  />
                ))
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
              pendingPatients={pendingPatients}
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
        onPropose={() => {
          if (!detailVisit) {
            return;
          }
          setProposeVisit(detailVisit);
          setDetailVisit(null);
        }}
        onCancel={() => {
          if (detailVisit) {
            void cancelOne(detailVisit.id);
          }
        }}
      />

      <ProposeTimeDialog
        visit={proposeVisit}
        open={Boolean(proposeVisit)}
        slotLabels={proposeSlots}
        slotIsos={proposeSlotIsos}
        onClose={() => {
          setProposeVisit(null);
        }}
        onSubmit={(proposedStartAt) => {
          if (!proposeVisit) {
            return;
          }
          void submitPropose(proposeVisit.id, proposedStartAt)
            .then(() => {
              toast.success(t('modals.proposeTitle'));
            })
            .catch(() => {
              toast.error(t('modals.proposeTitle'));
            });
        }}
      />

      <DayScheduleDialog
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
        }}
        visits={sortedVisits}
        freeWindows={freeWindows}
        onOpenVisit={(visit) => {
          setDetailVisit(visit);
        }}
      />
    </Page>
  );
};

/** @deprecated use DoctorDayPage */
export const DoctorDayStubPage = DoctorDayPage;
