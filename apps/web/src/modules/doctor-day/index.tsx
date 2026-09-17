import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useAppRole } from '@/hooks/useAppRole';
import { DoctorDayMetrics } from '@/modules/doctor-day/components/DoctorDayMetrics';
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
import { MOCK_DOCTOR_VISITS, MOCK_FREE_WINDOWS } from '@/modules/doctor-day/fixtures';
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
import { formatCabinetHeaderDate } from '@/modules/patient-room/utils/formatCabinetDate';

const DEMO_TODAY = new Date('2026-08-27T12:00:00+03:00');

const greetingKey = (hour: number) => {
  if (hour < 12) {
    return 'greetingMorning';
  }
  if (hour < 18) {
    return 'greetingDay';
  }
  return 'greetingEvening';
};

const nextUpcoming = (visits: DoctorDayVisit[]) =>
  visits.find((visit) => visit.status === 'upcoming');

export const DoctorDayPage = () => {
  const { t, i18n } = useTranslation('doctorDay');
  const { me } = useAppRole();
  const [tab, setTab] = useState<DoctorDayTab>('visits');
  const [visits, setVisits] = useState(MOCK_DOCTOR_VISITS);
  const [visibleCount, setVisibleCount] = useState(8);
  const [detailVisit, setDetailVisit] = useState<DoctorDayVisit | null>(null);
  const [proposeVisit, setProposeVisit] = useState<DoctorDayVisit | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const doctorName = me?.firstName ?? 'Оксано';
  const headerDate = formatCabinetHeaderDate(DEMO_TODAY, i18n.language);
  const heroVisit = nextUpcoming(visits);

  const sortedVisits = useMemo(
    () => [...visits].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [visits],
  );

  const filteredVisits = useMemo(() => {
    if (tab === 'pending') {
      return sortedVisits.filter((visit) => visit.status === 'reschedule_pending');
    }
    if (tab === 'cancellations') {
      return sortedVisits.filter((visit) => visit.status === 'cancelled');
    }
    if (tab === 'free') {
      return [];
    }
    return sortedVisits;
  }, [sortedVisits, tab]);

  const tabCounts: Record<DoctorDayTab, number> = {
    visits: sortedVisits.length,
    pending: sortedVisits.filter((visit) => visit.status === 'reschedule_pending').length,
    free: MOCK_FREE_WINDOWS.length,
    cancellations: sortedVisits.filter((visit) => visit.status === 'cancelled').length,
  };

  const shown = filteredVisits.slice(0, visibleCount);

  const markCompleted = (id: string) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === id ? { ...visit, status: 'completed' as const } : visit,
      ),
    );
    toast.success(t('rowActions.complete'));
  };

  const cancelVisit = (id: string) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === id
          ? { ...visit, status: 'cancelled' as const, cancelledBy: 'doctor' as const }
          : visit,
      ),
    );
    toast.message(t('rowActions.cancel'));
  };

  return (
    <Page>
      <Content>
        <GreetingRow>
          <GreetingCopy>
            <GreetingTitle>{t(greetingKey(DEMO_TODAY.getHours()), { name: doctorName })}</GreetingTitle>
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
              markCompleted(heroVisit.id);
            }}
            onPropose={() => {
              setProposeVisit(heroVisit);
            }}
            onCancel={() => {
              cancelVisit(heroVisit.id);
            }}
          />
        ) : null}

        <DoctorDayMetrics />

        <LayoutRow>
          <MainColumn>
            <DoctorDayTabs active={tab} counts={tabCounts} onChange={setTab} />

            <section>
              <SectionHead>
                <SectionTitle>{t('list.visitsTitle')}</SectionTitle>
                <SectionMeta>
                  {t('list.visitsMeta', {
                    total: sortedVisits.length,
                    shown: shown.length,
                  })}
                </SectionMeta>
              </SectionHead>

              {tab === 'free' ? (
                MOCK_FREE_WINDOWS.map((window) => (
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
                      markCompleted(visit.id);
                    }}
                    onPropose={() => {
                      setProposeVisit(visit);
                    }}
                    onCancel={() => {
                      cancelVisit(visit.id);
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
      />

      <ProposeTimeDialog
        visit={proposeVisit}
        open={Boolean(proposeVisit)}
        onClose={() => {
          setProposeVisit(null);
        }}
        onSubmit={() => {
          toast.success(t('modals.proposeTitle'));
        }}
      />

      <DayScheduleDialog
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
        }}
        visits={sortedVisits}
      />
    </Page>
  );
};

/** @deprecated use DoctorDayPage */
export const DoctorDayStubPage = DoctorDayPage;
