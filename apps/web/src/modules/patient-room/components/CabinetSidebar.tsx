import { IconChevronLeft, IconChevronRight, IconStarFilled } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
  CalendarGrid,
  CalendarHeader,
  CalendarLegend,
  CalendarMonth,
  CalendarNavButton,
  CalendarShell,
  DayCell,
  LegendDot,
  LegendItem,
  PromoClinic,
  PromoDoctorInfo,
  PromoDoctorRow,
  PromoRating,
  PromoSpecialty,
  WidgetAction,
  WidgetBody,
  WidgetCard,
  WidgetMeta,
  WidgetTitle,
  WeekdayCell,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment, CabinetDoctorCard } from '@/modules/patient-room/types';
import { appointmentDays } from '@/modules/patient-room/utils/appointmentsByDay';
import { formatTime, todayYmdKyiv } from '@/modules/patient-room/utils/formatCabinetDate';
import { doctorDisplayName } from '@/modules/patient-room/utils/mapCabinet';
import { AppRoute } from '@/utils/routeUtils/routes';

const WEEKDAYS_UK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export type CabinetSidebarVariant = 'desktop' | 'mobile-early' | 'mobile-calendar';

interface CabinetSidebarProps {
  variant?: CabinetSidebarVariant;
  appointments: CabinetAppointment[];
  /** Reminder only for today/tomorrow Upcoming — pass null to hide. */
  reminderVisit: CabinetAppointment | null;
  promoDoctor: CabinetDoctorCard | null;
  myReviews?: { leftCount: number; pendingCount: number };
  showCalendar?: boolean;
  showReviews?: boolean;
  onOpenVisit: () => void;
  onBookPromo: () => void;
  onOpenDay: (ymd: string) => void;
  onViewReviews?: () => void;
}

export const CabinetSidebar = ({
  variant = 'desktop',
  appointments,
  reminderVisit,
  promoDoctor,
  myReviews = { leftCount: 0, pendingCount: 0 },
  showCalendar = true,
  showReviews = true,
  onOpenVisit,
  onBookPromo,
  onOpenDay,
  onViewReviews,
}: CabinetSidebarProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const navigate = useNavigate();
  const [monthOffset, setMonthOffset] = useState(0);
  const todayYmd = todayYmdKyiv();

  const viewDate = useMemo(() => {
    const [year, month] = todayYmd.split('-').map(Number);
    return new Date(year!, (month ?? 1) - 1 + monthOffset, 1);
  }, [monthOffset, todayYmd]);

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
  const markedDays = useMemo(() => appointmentDays(appointments), [appointments]);

  const showCalendarBlock =
    showCalendar && (variant === 'desktop' || variant === 'mobile-calendar');
  const showEarlyWidgets = variant === 'desktop' || variant === 'mobile-early';
  const showReviewsBlock = showReviews && variant === 'desktop';
  const showHowBlock = variant === 'desktop' || variant === 'mobile-early';

  const reminderSpecialty = reminderVisit?.specialty
    ? t(`search:specialties.${reminderVisit.specialty}`, {
        defaultValue: reminderVisit.specialty,
      })
    : '';

  return (
    <>
      {showCalendarBlock ? (
        <CalendarShell>
          <WidgetTitle>{t('cabinet:sidebar.calendar')}</WidgetTitle>
          <CalendarHeader>
            <CalendarNavButton
              type="button"
              aria-label={t('cabinet:dayModal.prevMonth')}
              onClick={() => {
                setMonthOffset((value) => value - 1);
              }}
            >
              <IconChevronLeft size={18} />
            </CalendarNavButton>
            <CalendarMonth>{monthLabel}</CalendarMonth>
            <CalendarNavButton
              type="button"
              aria-label={t('cabinet:dayModal.nextMonth')}
              onClick={() => {
                setMonthOffset((value) => value + 1);
              }}
            >
              <IconChevronRight size={18} />
            </CalendarNavButton>
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
                $today={cell.ymd === todayYmd}
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
            <LegendItem>
              <LegendDot />
              {t('cabinet:sidebar.legendVisit')}
            </LegendItem>
            <span>{t('cabinet:sidebar.legendToday')}</span>
          </CalendarLegend>
        </CalendarShell>
      ) : null}

      {showEarlyWidgets && reminderVisit ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.reminderTitle')}</WidgetTitle>
          <WidgetBody>
            {t('cabinet:sidebar.reminderLine', {
              time: formatTime(reminderVisit.startsAt, i18n.language),
              doctor: doctorDisplayName(reminderVisit),
            })}
          </WidgetBody>
          <WidgetMeta>
            {t('cabinet:sidebar.reminderMeta', {
              format: t(`cabinet:format.${reminderVisit.format}`),
              specialty: reminderSpecialty,
              clinic: reminderVisit.clinicName,
            })}
          </WidgetMeta>
          <WidgetAction fullWidth variant="outlined" color="inherit" onClick={onOpenVisit}>
            {t('cabinet:sidebar.toVisit')}
          </WidgetAction>
        </WidgetCard>
      ) : null}

      {showEarlyWidgets && promoDoctor ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.newDoctor')}</WidgetTitle>
          <PromoDoctorRow>
            <DoctorPhoto
              photoUrl={promoDoctor.photoUrl}
              firstName={promoDoctor.firstName}
              lastName={promoDoctor.lastName}
              size="md"
            />
            <PromoDoctorInfo>
              <WidgetBody>
                {promoDoctor.firstName} {promoDoctor.lastName}
              </WidgetBody>
              <PromoSpecialty>
                {t(`search:specialties.${promoDoctor.specialty}`, {
                  defaultValue: promoDoctor.specialty,
                })}
              </PromoSpecialty>
              <PromoClinic>
                {[promoDoctor.clinicName, promoDoctor.cityName].filter(Boolean).join(', ')}
              </PromoClinic>
              <PromoRating>
                <IconStarFilled size={14} aria-hidden />
                {promoDoctor.ratingAverage > 0
                  ? promoDoctor.ratingAverage.toFixed(1)
                  : '—'}
              </PromoRating>
            </PromoDoctorInfo>
          </PromoDoctorRow>
          <WidgetAction
            fullWidth
            variant="contained"
            color="primary"
            onClick={onBookPromo}
          >
            {t('cabinet:sidebar.book')}
          </WidgetAction>
        </WidgetCard>
      ) : null}

      {showReviewsBlock ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.reviewsTitle')}</WidgetTitle>
          <WidgetBody>
            {t('cabinet:sidebar.reviewsSummary', { left: myReviews.leftCount })}
          </WidgetBody>
          <WidgetMeta>
            {t('cabinet:sidebar.reviewsPending', { count: myReviews.pendingCount })}
          </WidgetMeta>
          <WidgetAction fullWidth variant="outlined" color="inherit" onClick={onViewReviews}>
            {t('cabinet:sidebar.reviewsView')}
          </WidgetAction>
        </WidgetCard>
      ) : null}

      {showHowBlock ? (
        <WidgetCard>
          <WidgetTitle>{t('cabinet:sidebar.howTitle')}</WidgetTitle>
          <WidgetMeta>{t('cabinet:sidebar.howBody')}</WidgetMeta>
          <WidgetAction
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => {
              void navigate(AppRoute.HOME);
            }}
          >
            {t('cabinet:sidebar.toSearch')}
          </WidgetAction>
        </WidgetCard>
      ) : null}
    </>
  );
};
