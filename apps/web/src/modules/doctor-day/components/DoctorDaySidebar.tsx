import { IconCalendar, IconUserCircle } from '@tabler/icons-react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  MOCK_FREE_WINDOWS,
  MOCK_PENDING_ROWS,
  MOCK_WEEK_DAYS,
} from '@/modules/doctor-day/fixtures';
import type { DoctorDayVisit } from '@/modules/doctor-day/types';
import {
  FreeRow,
  PendingRow,
  QuickLink,
  WeekDay,
  WeekDays,
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
  onOpenSchedule: () => void;
  onOpenVisit: () => void;
}

export const DoctorDaySidebar = ({
  nextVisit,
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
          {MOCK_WEEK_DAYS.map((day) => (
            <WeekDay key={day.ymd} type="button" $active={day.isSelected}>
              <span>{day.weekdayShort}</span>
              <strong>{day.dayNumber}</strong>
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
        {MOCK_FREE_WINDOWS.map((window) => (
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
        {MOCK_PENDING_ROWS.map((row) => (
          <PendingRow key={row.id}>
            {t('sidebar.pendingRow', {
              patient: row.patientName,
              from: row.fromTime,
              to: row.toTime,
            })}
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
