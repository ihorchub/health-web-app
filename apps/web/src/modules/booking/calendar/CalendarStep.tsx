import { Switch } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { DayAvailabilityFlag, DoctorCalendarResponse } from '@/api/doctors';
import {
  CalendarBody,
  DayCell,
  DayDot,
  DayGrid,
  DayRow,
  EmptyCopy,
  EmptyMascot,
  EmptyState,
  FormatBlock,
  FormatSideLabel,
  FormatToggleRow,
  LegendItem,
  LegendLabel,
  LegendRow,
  LegendSwatch,
  LoadingState,
  MonthCard,
  MonthHeader,
  MonthsRow,
  MonthTitle,
  SlotChip,
  SlotSkeleton,
  SlotsBlock,
  SlotsContent,
  SlotsGrid,
  SlotsHeading,
  SlotsSubtitle,
  SlotsTitle,
  WeekdayCell,
  WeekdayRow,
} from '@/modules/booking/calendar/styles';
import { FieldLabel } from '@/modules/booking/doctor-profile/styles';
import {
  formatMonthTitle,
  formatSelectedDayHeading,
  formatSlotTime,
  weekdayLabels,
} from '@/modules/booking/wizard/formatBookingDate';
import type { BookingVisitFormat } from '@/modules/booking/wizard/types';
import {
  addMonths,
  daysInMonth,
  mondayBasedWeekday,
  parseIsoDate,
  toIsoDate,
} from '@/utils/dateUtils/rollingMonth';

const LIKA_EMPTY = '/brand/lika-poses/lika4.png';
const LIKA_LOADING = '/brand/lika-poses/lika3.png';

interface CalendarStepProps {
  calendar: DoctorCalendarResponse | undefined;
  isLoading: boolean;
  isSlotsLoading: boolean;
  selectedDate: string;
  selectedStartAt: string | null;
  format: BookingVisitFormat;
  onSelectDate: (date: string) => void;
  onSelectSlot: (startAt: string) => void;
  onFormatChange: (format: BookingVisitFormat) => void;
}

interface MonthCellModel {
  key: string;
  dayNumber: number | null;
  iso: string | null;
  flag: DayAvailabilityFlag | null;
  inMonth: boolean;
}

const buildMonthCells = (
  year: number,
  monthIndex: number,
  flagByDate: Map<string, DayAvailabilityFlag>,
): MonthCellModel[] => {
  const first = new Date(year, monthIndex, 1);
  const leading = mondayBasedWeekday(first);
  const totalDays = daysInMonth(year, monthIndex);
  const cells: MonthCellModel[] = [];

  for (let i = 0; i < leading; i += 1) {
    const prev = new Date(year, monthIndex, -leading + i + 1);
    cells.push({
      key: `pad-prev-${i}`,
      dayNumber: prev.getDate(),
      iso: null,
      flag: null,
      inMonth: false,
    });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const iso = toIsoDate(new Date(year, monthIndex, day));
    cells.push({
      key: iso,
      dayNumber: day,
      iso,
      flag: flagByDate.get(iso) ?? 'outside_window',
      inMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    const nextIndex = cells.length - leading - totalDays;
    cells.push({
      key: `pad-next-${nextIndex}`,
      dayNumber: nextIndex + 1,
      iso: null,
      flag: null,
      inMonth: false,
    });
  }

  return cells;
};

const chunkWeeks = <T,>(items: T[]): T[][] => {
  const weeks: T[][] = [];
  for (let i = 0; i < items.length; i += 7) {
    weeks.push(items.slice(i, i + 7));
  }
  return weeks;
};

const isSelectable = (flag: DayAvailabilityFlag | null) => flag === 'has_free';

export const CalendarStep = ({
  calendar,
  isLoading,
  isSlotsLoading,
  selectedDate,
  selectedStartAt,
  format,
  onSelectDate,
  onSelectSlot,
  onFormatChange,
}: CalendarStepProps) => {
  const { t, i18n } = useTranslation('booking');

  const zoneStart = calendar ? parseIsoDate(calendar.zoneAStart) : new Date();
  const leftMonth = new Date(zoneStart.getFullYear(), zoneStart.getMonth(), 1);
  const rightMonth = addMonths(leftMonth, 1);

  const flagByDate = useMemo(() => {
    const map = new Map<string, DayAvailabilityFlag>();
    calendar?.days.forEach((day) => {
      map.set(day.date, day.flag);
    });
    return map;
  }, [calendar?.days]);

  const weekdays = weekdayLabels(i18n.language);
  const showFormatToggle = (calendar?.supportedFormats.length ?? 0) > 1;

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const weeks = chunkWeeks(buildMonthCells(year, monthIndex, flagByDate));

    return (
      <MonthCard>
        <MonthHeader>
          <MonthTitle>{formatMonthTitle(year, monthIndex, i18n.language)}</MonthTitle>
        </MonthHeader>

        <DayGrid>
          <WeekdayRow>
            {weekdays.map((label) => (
              <WeekdayCell key={label}>{label}</WeekdayCell>
            ))}
          </WeekdayRow>
          {weeks.map((week, weekIndex) => (
            <DayRow key={`${year}-${monthIndex}-${weekIndex}`}>
              {week.map((cell) => {
                if (!cell.inMonth || !cell.iso || !cell.flag) {
                  return (
                    <DayCell key={cell.key} type="button" disabled $muted>
                      {cell.dayNumber}
                    </DayCell>
                  );
                }

                const selected = cell.iso === selectedDate;
                const hasFree = cell.flag === 'has_free';
                const muted =
                  cell.flag === 'past' ||
                  cell.flag === 'outside_window' ||
                  cell.flag === 'day_off' ||
                  cell.flag === 'full';
                const selectable = isSelectable(cell.flag);

                return (
                  <DayCell
                    key={cell.key}
                    type="button"
                    disabled={!selectable}
                    $selected={selected}
                    $hasFree={hasFree && !selected}
                    $muted={muted}
                    onClick={() => {
                      if (selectable) {
                        onSelectDate(cell.iso!);
                      }
                    }}
                  >
                    {cell.dayNumber}
                    {!selected && hasFree ? <DayDot $active /> : null}
                  </DayCell>
                );
              })}
            </DayRow>
          ))}
        </DayGrid>
      </MonthCard>
    );
  };

  const renderSlotsContent = () => {
    if (isLoading && !calendar) {
      return (
        <LoadingState>
          <EmptyMascot src={LIKA_LOADING} alt="" />
          <EmptyCopy>{t('calendar.loading')}</EmptyCopy>
        </LoadingState>
      );
    }

    if (isSlotsLoading) {
      return (
        <SlotsGrid aria-busy>
          {Array.from({ length: 6 }).map((_, index) => (
            <SlotSkeleton key={index} />
          ))}
        </SlotsGrid>
      );
    }

    if (!calendar || calendar.slots.length === 0) {
      return (
        <EmptyState>
          <EmptyMascot src={LIKA_EMPTY} alt="" />
          <EmptyCopy>{t('calendar.emptyDay')}</EmptyCopy>
        </EmptyState>
      );
    }

    return (
      <SlotsGrid>
        {calendar.slots.map((slot) => (
          <SlotChip
            key={slot.startAt}
            type="button"
            $selected={slot.startAt === selectedStartAt}
            onClick={() => {
              onSelectSlot(slot.startAt);
            }}
          >
            {formatSlotTime(slot.startAt)}
          </SlotChip>
        ))}
      </SlotsGrid>
    );
  };

  return (
    <CalendarBody>
      {calendar || isLoading ? (
        <>
          <MonthsRow>
            {renderMonth(leftMonth)}
            {renderMonth(rightMonth)}
          </MonthsRow>

          <LegendRow>
            <LegendItem>
              <LegendSwatch $size="lg" $tone="accent" />
              <LegendLabel>{t('calendar.legendSelected')}</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendSwatch $size="sm" $tone="accent" />
              <LegendLabel>{t('calendar.legendFree')}</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendSwatch $size="lg" $tone="muted" />
              <LegendLabel>{t('calendar.legendUnavailable')}</LegendLabel>
            </LegendItem>
          </LegendRow>

          <SlotsBlock>
            <SlotsHeading>
              <SlotsTitle>
                {selectedDate
                  ? formatSelectedDayHeading(selectedDate, i18n.language)
                  : t('calendar.pickDay')}
              </SlotsTitle>
              <SlotsSubtitle>{t('calendar.freeTimes')}</SlotsSubtitle>
            </SlotsHeading>
            <SlotsContent>{renderSlotsContent()}</SlotsContent>
          </SlotsBlock>

          <FormatBlock>
            <FieldLabel>{t('format')}</FieldLabel>
            {showFormatToggle ? (
              <FormatToggleRow>
                <FormatSideLabel $active={format === 'offline'}>
                  {t('formatOffline')}
                </FormatSideLabel>
                <Switch
                  checked={format === 'online'}
                  onChange={(_, checked) => {
                    onFormatChange(checked ? 'online' : 'offline');
                  }}
                  slotProps={{ input: { 'aria-label': t('format') } }}
                  color="primary"
                  size="small"
                />
                <FormatSideLabel $active={format === 'online'}>
                  {t('formatOnline')}
                </FormatSideLabel>
              </FormatToggleRow>
            ) : (
              <FormatSideLabel $active>
                {format === 'online' ? t('formatOnline') : t('formatOffline')}
              </FormatSideLabel>
            )}
          </FormatBlock>
        </>
      ) : null}
    </CalendarBody>
  );
};
