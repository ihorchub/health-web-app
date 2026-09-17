import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { DoctorSearchCard } from '@/api/doctors';
import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  CalendarGrid,
  CalendarHeader,
  CalendarLegend,
  CalendarMonth,
  CalendarShell,
  DayCell,
  LegendItem,
  PromoAvatar,
  PromoDoctorRow,
  WidgetAction,
  WidgetBody,
  WidgetCard,
  WidgetMeta,
  WidgetTitle,
  WeekdayCell,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import { appointmentDays } from '@/modules/patient-room/utils/appointmentsByDay';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { AppRoute } from '@/utils/routeUtils/routes';

const WEEKDAYS_UK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface CabinetSidebarProps {
  appointments: CabinetAppointment[];
  nextVisit: CabinetAppointment | null;
  promoDoctor: DoctorSearchCard | null;
  onOpenVisit: () => void;
  onBookPromo: () => void;
  onOpenDay: (ymd: string) => void;
}

export const CabinetSidebar = ({
  appointments,
  nextVisit,
  promoDoctor,
  onOpenVisit,
  onBookPromo,
  onOpenDay,
}: CabinetSidebarProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const navigate = useNavigate();
  const [monthOffset, setMonthOffset] = useState(0);

  const viewDate = useMemo(() => {
    const base = new Date('2026-08-01T12:00:00+03:00');
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const monthLabel = new Intl.DateTimeFormat(i18n.language === 'uk' ? 'uk-UA' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(viewDate);

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; ymd: string | null }> = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push({ day: null, ymd: null });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, ymd });
    }

    return cells;
  }, [viewDate]);

  const weekdays = i18n.language === 'uk' ? WEEKDAYS_UK : WEEKDAYS_EN;
  const nextDoctor = nextVisit ? findMockDoctor(nextVisit.doctorId) : null;
  const markedDays = useMemo(() => appointmentDays(appointments), [appointments]);

  return (
    <>
      <CalendarShell>
        <WidgetTitle>{t('cabinet:sidebar.calendar')}</WidgetTitle>
        <CalendarHeader>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => {
              setMonthOffset((value) => value - 1);
            }}
          >
            <IconChevronLeft size={18} />
          </button>
          <CalendarMonth>{monthLabel}</CalendarMonth>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => {
              setMonthOffset((value) => value + 1);
            }}
          >
            <IconChevronRight size={18} />
          </button>
        </CalendarHeader>
        <CalendarGrid>
          {weekdays.map((label) => (
            <WeekdayCell key={label}>{label}</WeekdayCell>
          ))}
          {calendarCells.map((cell, index) => (
            <DayCell
              key={cell.ymd ?? `empty-${index}`}
              type="button"
              disabled={!cell.day}
              $muted={!cell.day}
              $today={cell.ymd === '2026-08-27'}
              $marked={cell.ymd ? markedDays.includes(cell.ymd) : false}
              onClick={() => {
                if (cell.ymd && markedDays.includes(cell.ymd)) {
                  onOpenDay(cell.ymd);
                }
              }}
            >
              {cell.day ?? ''}
            </DayCell>
          ))}
        </CalendarGrid>
        <CalendarLegend>
          <LegendItem>{t('cabinet:sidebar.legendVisit')}</LegendItem>
          <span>{t('cabinet:sidebar.legendToday')}</span>
        </CalendarLegend>
      </CalendarShell>

      {nextVisit && nextDoctor ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.reminderTitle')}</WidgetTitle>
          <WidgetBody>
            {t('cabinet:sidebar.reminderLine', {
              time: formatTime(nextVisit.startsAt, i18n.language),
              doctor: `${nextDoctor.firstName} ${nextDoctor.lastName}`,
            })}
          </WidgetBody>
          <WidgetMeta>
            {t('cabinet:sidebar.reminderMeta', {
              format: t(`cabinet:format.${nextVisit.format}`),
              specialty: t(`search:specialties.${nextDoctor.specialty}`),
              clinic: t('cabinet:demoClinic'),
            })}
          </WidgetMeta>
          <WidgetAction variant="outlined" color="inherit" onClick={onOpenVisit}>
            {t('cabinet:sidebar.toVisit')}
          </WidgetAction>
        </WidgetCard>
      ) : null}

      {promoDoctor ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.newDoctor')}</WidgetTitle>
          <PromoDoctorRow>
            <PromoAvatar src={promoDoctor.photoUrl} alt="" />
            <div>
              <WidgetBody>
                {promoDoctor.firstName} {promoDoctor.lastName}
              </WidgetBody>
              <WidgetMeta>{t(`search:specialties.${promoDoctor.specialty}`)}</WidgetMeta>
            </div>
          </PromoDoctorRow>
          <WidgetAction variant="contained" color="primary" onClick={onBookPromo}>
            {t('cabinet:sidebar.book')}
          </WidgetAction>
        </WidgetCard>
      ) : null}

      <WidgetCard>
        <WidgetTitle>{t('cabinet:sidebar.reviewsTitle')}</WidgetTitle>
        <WidgetBody>{t('cabinet:sidebar.reviewsSummary', { left: 2 })}</WidgetBody>
        <WidgetMeta>{t('cabinet:sidebar.reviewsPending', { count: 1 })}</WidgetMeta>
        <WidgetAction variant="text" color="primary">
          {t('cabinet:sidebar.reviewsView')}
        </WidgetAction>
      </WidgetCard>

      <WidgetCard>
        <WidgetTitle>{t('cabinet:sidebar.howTitle')}</WidgetTitle>
        <WidgetMeta>{t('cabinet:sidebar.howBody')}</WidgetMeta>
        <WidgetAction
          variant="text"
          color="primary"
          onClick={() => {
            void navigate(AppRoute.HOME);
          }}
        >
          {t('cabinet:sidebar.toSearch')}
        </WidgetAction>
      </WidgetCard>
    </>
  );
};
