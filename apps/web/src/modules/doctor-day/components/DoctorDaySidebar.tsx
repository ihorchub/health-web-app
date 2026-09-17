import { IconCalendar, IconUserCircle } from '@tabler/icons-react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type {
  DoctorDayVisit,
  FreeWindowSlot,
  PendingPatientRow,
  WeekDaySummary,
} from '@/modules/doctor-day/types';
import {
  FreeRow,
  PendingAvatar,
  PendingCopy,
  PendingMeta,
  PendingName,
  PendingRow,
  QuickLink,
  WeekDay,
  WeekDayLabel,
  WeekDayNumber,
  WeekDays,
  WeekDot,
  WeekDots,
  WeekLegend,
  WidgetCard,
  WidgetHead,
  WidgetLink,
  WidgetMeta,
  WidgetTitle,
} from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { AppRoute } from '@/utils/routeUtils/routes';

interface DoctorDaySidebarProps {
  nextVisit: DoctorDayVisit | null;
  weekDays: WeekDaySummary[];
  freeWindows: FreeWindowSlot[];
  pendingPatients: PendingPatientRow[];
  onOpenSchedule: () => void;
  onOpenVisit: () => void;
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const weekDots = (day: WeekDaySummary) => {
  const dots: Array<'visit' | 'pending' | 'cancelled' | 'free'> = [];
  if (day.visits > 0) {
    dots.push('visit');
  }
  if (day.pending > 0) {
    dots.push('pending');
  }
  if (day.cancelled > 0) {
    dots.push('cancelled');
  }
  if (dots.length === 0 && day.free > 0) {
    dots.push('free');
  }
  if (dots.length === 0) {
    dots.push('free');
  }
  return dots.slice(0, 3);
};

export const DoctorDaySidebar = ({
  nextVisit,
  weekDays,
  freeWindows,
  pendingPatients,
  onOpenSchedule,
  onOpenVisit,
}: DoctorDaySidebarProps) => {
  const { t, i18n } = useTranslation('doctorDay');
  const navigate = useNavigate();

  return (
    <>
      <WidgetCard>
        <WidgetHead>
          <WidgetTitle>{t('sidebar.weekTitle')}</WidgetTitle>
          <WidgetLink type="button" onClick={onOpenSchedule}>
            {t('sidebar.weekView')}
          </WidgetLink>
        </WidgetHead>
        <WeekDays>
          {weekDays.map((day) => (
            <WeekDay key={day.ymd} type="button" $active={day.isSelected}>
              <WeekDayLabel $active={day.isSelected}>{day.weekdayShort}</WeekDayLabel>
              <WeekDayNumber $active={day.isSelected}>{day.dayNumber}</WeekDayNumber>
              <WeekDots>
                {weekDots(day).map((tone, index) => (
                  <WeekDot key={`${day.ymd}-${tone}-${index}`} $tone={tone} />
                ))}
              </WeekDots>
            </WeekDay>
          ))}
        </WeekDays>
        <WeekLegend>
          <span>{t('sidebar.legendVisits')}</span>
          <span>{t('sidebar.legendFree')}</span>
          <span>{t('sidebar.legendPending')}</span>
          <span>{t('sidebar.legendCancelled')}</span>
        </WeekLegend>
      </WidgetCard>

      {nextVisit ? (
        <WidgetCard>
          <WidgetTitle>{t('sidebar.reminderTitle')}</WidgetTitle>
          <strong>
            {t('sidebar.reminderLine', {
              minutes: 45,
              patient: nextVisit.patientName,
            })}
          </strong>
          <WidgetMeta>
            {t('sidebar.reminderMeta', {
              time: formatTime(nextVisit.startsAt, i18n.language),
              format: t(`format.${nextVisit.format}`),
              reason: nextVisit.reason ?? '—',
            })}
          </WidgetMeta>
          <Button variant="outlined" color="inherit" onClick={onOpenVisit}>
            {t('sidebar.toVisit')}
          </Button>
        </WidgetCard>
      ) : null}

      <WidgetCard>
        <WidgetHead>
          <WidgetTitle>{t('sidebar.freeTitle')}</WidgetTitle>
          <WidgetLink
            type="button"
            onClick={() => {
              void navigate(AppRoute.DOCTOR_HOURS);
            }}
          >
            {t('sidebar.scheduleLink')}
          </WidgetLink>
        </WidgetHead>
        {freeWindows.map((window) => (
          <FreeRow key={window.id}>
            <span>
              {t('sidebar.freeRow', {
                start: window.start,
                end: window.end,
                count: window.slotsCount,
              })}
            </span>
          </FreeRow>
        ))}
      </WidgetCard>

      <WidgetCard>
        <WidgetTitle>{t('sidebar.pendingTitle')}</WidgetTitle>
        {pendingPatients.map((row) => (
          <PendingRow key={row.id}>
            <PendingAvatar>{initials(row.patientName)}</PendingAvatar>
            <PendingCopy>
              <PendingName>{row.patientName}</PendingName>
              <PendingMeta>
                {row.fromTime.includes(' ')
                  ? `${row.fromTime} → ${row.toTime}`
                  : t('sidebar.pendingRowTime', { from: row.fromTime, to: row.toTime })}
              </PendingMeta>
            </PendingCopy>
          </PendingRow>
        ))}
      </WidgetCard>

      <WidgetCard>
        <WidgetTitle>{t('sidebar.quickTitle')}</WidgetTitle>
        <QuickLink
          type="button"
          onClick={() => {
            void navigate(AppRoute.DOCTOR_HOURS);
          }}
        >
          <IconCalendar size={18} />
          {t('sidebar.mySchedule')}
        </QuickLink>
        <QuickLink
          type="button"
          onClick={() => {
            void navigate(AppRoute.PROFILE);
          }}
        >
          <IconUserCircle size={18} />
          {t('sidebar.myProfile')}
        </QuickLink>
      </WidgetCard>
    </>
  );
};
