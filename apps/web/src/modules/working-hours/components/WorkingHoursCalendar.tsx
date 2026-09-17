import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DEMO_SCHEDULE_ANCHOR,
  MOCK_WORKING_HOURS,
} from '@/modules/working-hours/fixtures';
import {
  Card,
  CardTitle,
  DayCell,
  DayGrid,
  LegendRow,
  MonthBlock,
  MonthLabel,
  MonthsGrid,
  Weekday,
  ZoneStrip,
  ZoneStripRow,
} from '@/modules/working-hours/styles';
import {
  buildThreeMonthBlocks,
  formatDisplayDate,
  isWeekendYmd,
  monthTitle,
  zoneForDate,
} from '@/modules/working-hours/utils/calendarGrid';

interface WorkingHoursCalendarProps {
  anchorYm: string;
  todayYmd: string;
  appointmentDays: Set<string>;
}

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export const WorkingHoursCalendar = ({
  anchorYm,
  todayYmd,
  appointmentDays,
}: WorkingHoursCalendarProps) => {
  const { t, i18n } = useTranslation('workingHours');
  const { zoneAStartYmd, zoneAEndYmd, zoneBStartYmd } = MOCK_WORKING_HOURS;

  const months = useMemo(() => buildThreeMonthBlocks(anchorYm), [anchorYm]);

  return (
    <Card>
      <CardTitle>{t('calendarTitle')}</CardTitle>
      <LegendRow>
        <span>{t('legendToday')}</span>
        <span>·</span>
        <span>{t('legendAppointments')}</span>
        <span>·</span>
        <span>{t('legendWeekend')}</span>
      </LegendRow>
      <ZoneStripRow>
        <ZoneStrip $tone="a">
          {t('zoneAStrip')} · {t('zoneARange', {
            start: formatDisplayDate(zoneAStartYmd, i18n.language),
            end: formatDisplayDate(zoneAEndYmd, i18n.language),
          })}
        </ZoneStrip>
        <ZoneStrip $tone="b">
          {t('zoneBStrip')} · {t('zoneBFrom', {
            date: formatDisplayDate(zoneBStartYmd, i18n.language),
          })}
        </ZoneStrip>
      </ZoneStripRow>
      <MonthsGrid>
        {months.map((block) => (
          <MonthBlock key={`${block.year}-${block.monthIndex}`}>
            <MonthLabel>{monthTitle(block.year, block.monthIndex, i18n.language)}</MonthLabel>
            <DayGrid>
              {WEEKDAY_KEYS.map((key) => (
                <Weekday key={key}>{t(`weekdays.${key}`)}</Weekday>
              ))}
              {block.cells.map((cell, index) => {
                if (!cell.inMonth) {
                  return <span key={`pad-${index}`} />;
                }
                const zone = zoneForDate(cell.ymd, zoneAStartYmd, zoneAEndYmd, zoneBStartYmd);
                return (
                  <DayCell
                    key={cell.ymd}
                    type="button"
                    disabled
                    $zone={zone}
                    $today={cell.ymd === todayYmd}
                    $weekend={isWeekendYmd(cell.ymd)}
                    $marked={appointmentDays.has(cell.ymd)}
                    aria-label={cell.ymd}
                  >
                    {cell.dayNumber}
                  </DayCell>
                );
              })}
            </DayGrid>
          </MonthBlock>
        ))}
      </MonthsGrid>
    </Card>
  );
};

export const WORKING_HOURS_DEMO_TODAY = DEMO_SCHEDULE_ANCHOR;
