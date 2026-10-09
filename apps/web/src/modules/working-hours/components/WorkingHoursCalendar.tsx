import { IconInfoCircle } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardHeader,
  CardTitle,
  DayCell,
  DayGrid,
  LegendDot,
  LegendItem,
  LegendPlanned,
  LegendRegularOff,
  LegendRow,
  LegendToday,
  LegendVacation,
  MonthBlock,
  MonthLabel,
  MonthsGrid,
  Weekday,
  ZoneStrip,
  ZoneStripCopy,
  ZoneStripMeta,
  ZoneStripStack,
  ZoneStripTitle,
} from '@/modules/working-hours/styles';
import {
  buildThreeMonthBlocks,
  formatDisplayDate,
  isWeekendYmd,
  monthTitle,
  zoneForDate,
} from '@/modules/working-hours/utils/calendarGrid';

export interface CalendarSelection {
  startYmd: string | null;
  endYmd: string | null;
}

interface WorkingHoursCalendarProps {
  anchorYm: string;
  todayYmd: string;
  zoneAStartYmd: string;
  zoneAEndYmd: string;
  zoneBStartYmd: string;
  zoneBEndYmd: string;
  appointmentDays: Set<string>;
  /** One-off exceptions (and Zone A vacation) — delicate accent marker. */
  vacationDays: Set<string>;
  /** Regular weekly days off in Zone B from working-days rule. */
  regularOffDays: Set<string>;
  plannedDays: Set<string>;
  selection: CalendarSelection;
  exceptionPickMode?: boolean;
  onDaySelect: (ymd: string, zone: 'a' | 'b') => void;
}

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const isInRange = (ymd: string, start: string | null, end: string | null) => {
  if (!start || !end || start === end) {
    return false;
  }
  const from = start < end ? start : end;
  const to = start < end ? end : start;
  return ymd > from && ymd < to;
};

export const WorkingHoursCalendar = ({
  anchorYm,
  todayYmd,
  zoneAStartYmd,
  zoneAEndYmd,
  zoneBStartYmd,
  zoneBEndYmd,
  appointmentDays,
  vacationDays,
  regularOffDays,
  plannedDays,
  selection,
  exceptionPickMode = false,
  onDaySelect,
}: WorkingHoursCalendarProps) => {
  const { t, i18n } = useTranslation('workingHours');
  const theme = useTheme();

  const months = useMemo(() => buildThreeMonthBlocks(anchorYm), [anchorYm]);

  const endpoints = useMemo(() => {
    const { startYmd, endYmd } = selection;
    if (!startYmd) {
      return new Set<string>();
    }
    if (!endYmd) {
      return new Set([startYmd]);
    }
    return new Set([startYmd, endYmd]);
  }, [selection]);

  const zoneARange = t('zoneARange', {
    start: formatDisplayDate(zoneAStartYmd, i18n.language),
    end: formatDisplayDate(zoneAEndYmd, i18n.language),
  });
  const zoneBRange = t('zoneARange', {
    start: formatDisplayDate(zoneBStartYmd, i18n.language),
    end: formatDisplayDate(zoneBEndYmd, i18n.language),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calendarTitle')}</CardTitle>
        <LegendRow>
          <LegendItem>
            <LegendToday />
            {t('legendToday')}
          </LegendItem>
          <LegendItem>
            <LegendDot />
            {t('legendAppointments')}
          </LegendItem>
          <LegendItem>
            <LegendRegularOff />
            {t('legendRegularOff')}
          </LegendItem>
          <LegendItem>
            <LegendVacation />
            {t('legendException')}
          </LegendItem>
          <LegendItem>
            <LegendPlanned />
            {t('legendPlanned')}
          </LegendItem>
        </LegendRow>
      </CardHeader>

      <ZoneStripStack>
        <ZoneStrip $tone="a">
          <IconInfoCircle
            size={18}
            color={theme.palette.mode === 'light' ? '#4A3836' : '#C9A39E'}
          />
          <ZoneStripCopy>
            <ZoneStripTitle $tone="a">{t('zoneAStrip')}</ZoneStripTitle>
            <ZoneStripMeta $tone="a">{zoneARange}</ZoneStripMeta>
          </ZoneStripCopy>
        </ZoneStrip>
        <ZoneStrip $tone="b">
          <IconInfoCircle size={18} color={theme.palette.primary.dark} />
          <ZoneStripCopy>
            <ZoneStripTitle $tone="b">{t('zoneBStrip')}</ZoneStripTitle>
            <ZoneStripMeta $tone="b">{zoneBRange}</ZoneStripMeta>
          </ZoneStripCopy>
        </ZoneStrip>
      </ZoneStripStack>

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
                const zone = zoneForDate(
                  cell.ymd,
                  zoneAStartYmd,
                  zoneAEndYmd,
                  zoneBStartYmd,
                  zoneBEndYmd,
                );
                const past = cell.ymd < zoneAStartYmd;
                const selectable = !past && (zone === 'a' || zone === 'b');
                const selected = endpoints.has(cell.ymd);
                const inRange = isInRange(cell.ymd, selection.startYmd, selection.endYmd);
                const isException = vacationDays.has(cell.ymd);
                const isRegularOff = regularOffDays.has(cell.ymd) && !isException;
                const isPlanned = plannedDays.has(cell.ymd) && !isException;

                return (
                  <DayCell
                    key={cell.ymd}
                    type="button"
                    disabled={!selectable}
                    $zone={zone}
                    $today={cell.ymd === todayYmd}
                    $weekend={isWeekendYmd(cell.ymd)}
                    $marked={appointmentDays.has(cell.ymd) && !isException}
                    $vacation={isException}
                    $regularOff={isRegularOff}
                    $planned={isPlanned}
                    $past={past}
                    $selected={selected || (exceptionPickMode && zone === 'b' && selected)}
                    $inRange={inRange}
                    $selectable={selectable}
                    aria-label={cell.ymd}
                    aria-pressed={selected}
                    onClick={() => {
                      if (selectable && (zone === 'a' || zone === 'b')) {
                        onDaySelect(cell.ymd, zone);
                      }
                    }}
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
