import { IconCalendarEvent, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Popover, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  PeriodField,
  PickerDay,
  PickerGrid,
  PickerHead,
  PickerNavButton,
  PickerPanel,
  PickerWeekday,
} from '@/modules/working-hours/styles';
import {
  buildSingleMonthBlock,
  monthTitle,
  shiftYm,
  ymdToYm,
} from '@/modules/working-hours/utils/calendarGrid';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

interface ZoneDateFieldProps {
  label: string;
  valueYmd: string;
  minYmd: string;
  maxYmd: string;
  onPick: (ymd: string) => void;
  /** Calendar icon before the label (exceptions row). Default: after. */
  iconStart?: boolean;
  compact?: boolean;
}

export const ZoneDateField = ({
  label,
  valueYmd,
  minYmd,
  maxYmd,
  onPick,
  iconStart = false,
  compact = false,
}: ZoneDateFieldProps) => {
  const { t, i18n } = useTranslation('workingHours');
  const theme = useTheme();
  const muted = theme.palette.text.secondary;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [viewYm, setViewYm] = useState(() => ymdToYm(valueYmd || minYmd));

  const minYm = ymdToYm(minYmd);
  const maxYm = ymdToYm(maxYmd);
  const open = Boolean(anchorEl);

  const month = useMemo(() => buildSingleMonthBlock(viewYm), [viewYm]);

  const openPicker = (event: React.MouseEvent<HTMLElement>) => {
    setViewYm(ymdToYm(valueYmd || minYmd));
    setAnchorEl(event.currentTarget);
  };

  const closePicker = () => {
    setAnchorEl(null);
  };

  const calendarIcon = (
    <IconCalendarEvent size={compact ? 14 : 18} color={muted} aria-hidden />
  );

  return (
    <>
      <PeriodField type="button" onClick={openPicker} $compact={compact}>
        {iconStart ? calendarIcon : null}
        <span>{label}</span>
        {iconStart ? null : calendarIcon}
      </PeriodField>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePicker}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <PickerPanel>
          <PickerHead>
            <PickerNavButton
              type="button"
              aria-label={t('datePicker.prevMonth')}
              disabled={viewYm <= minYm}
              onClick={() => {
                setViewYm((prev) => shiftYm(prev, -1));
              }}
            >
              <IconChevronLeft size={18} />
            </PickerNavButton>
            <strong>{monthTitle(month.year, month.monthIndex, i18n.language)}</strong>
            <PickerNavButton
              type="button"
              aria-label={t('datePicker.nextMonth')}
              disabled={viewYm >= maxYm}
              onClick={() => {
                setViewYm((prev) => shiftYm(prev, 1));
              }}
            >
              <IconChevronRight size={18} />
            </PickerNavButton>
          </PickerHead>

          <PickerGrid>
            {WEEKDAY_KEYS.map((key) => (
              <PickerWeekday key={key}>{t(`weekdays.${key}`)}</PickerWeekday>
            ))}
            {month.cells.map((cell, index) => {
              if (!cell.inMonth) {
                return <span key={`pad-${index}`} />;
              }
              const disabled = cell.ymd < minYmd || cell.ymd > maxYmd;
              const selected = cell.ymd === valueYmd;
              return (
                <PickerDay
                  key={cell.ymd}
                  type="button"
                  disabled={disabled}
                  $selected={selected}
                  onClick={() => {
                    onPick(cell.ymd);
                    closePicker();
                  }}
                >
                  {cell.dayNumber}
                </PickerDay>
              );
            })}
          </PickerGrid>
        </PickerPanel>
      </Popover>
    </>
  );
};
