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
  ReasonHint,
} from '@/modules/working-hours/styles';
import {
  buildSingleMonthBlock,
  formatDisplayDate,
  monthTitle,
  shiftYm,
  ymdToYm,
} from '@/modules/working-hours/utils/calendarGrid';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

interface ZoneDateRangeFieldProps {
  startYmd: string;
  endYmd: string;
  minYmd: string;
  maxYmd: string;
  locale: string;
  onRangeChange: (startYmd: string, endYmd: string) => void;
}

export const ZoneDateRangeField = ({
  startYmd,
  endYmd,
  minYmd,
  maxYmd,
  locale,
  onRangeChange,
}: ZoneDateRangeFieldProps) => {
  const { t, i18n } = useTranslation('workingHours');
  const theme = useTheme();
  const muted = theme.palette.text.secondary;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [viewYm, setViewYm] = useState(() => ymdToYm(startYmd || minYmd));
  const [draftStart, setDraftStart] = useState<string | null>(null);

  const minYm = ymdToYm(minYmd);
  const maxYm = ymdToYm(maxYmd);
  const open = Boolean(anchorEl);
  const month = useMemo(() => buildSingleMonthBlock(viewYm), [viewYm]);

  const label =
    startYmd && endYmd
      ? `${formatDisplayDate(startYmd, locale)} – ${formatDisplayDate(endYmd, locale)}`
      : t('datePicker.pickRange');

  const openPicker = (event: React.MouseEvent<HTMLElement>) => {
    setDraftStart(null);
    setViewYm(ymdToYm(startYmd || minYmd));
    setAnchorEl(event.currentTarget);
  };

  const closePicker = () => {
    setDraftStart(null);
    setAnchorEl(null);
  };

  return (
    <>
      <PeriodField type="button" onClick={openPicker}>
        <span>{label}</span>
        <IconCalendarEvent size={18} color={muted} aria-hidden />
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

          <ReasonHint>
            {draftStart ? t('datePicker.pickEnd') : t('datePicker.pickStart')}
          </ReasonHint>

          <PickerGrid>
            {WEEKDAY_KEYS.map((key) => (
              <PickerWeekday key={key}>{t(`weekdays.${key}`)}</PickerWeekday>
            ))}
            {month.cells.map((cell, index) => {
              if (!cell.inMonth) {
                return <span key={`pad-${index}`} />;
              }
              const disabled = cell.ymd < minYmd || cell.ymd > maxYmd;
              const inCurrentRange =
                !draftStart &&
                startYmd &&
                endYmd &&
                cell.ymd >= (startYmd < endYmd ? startYmd : endYmd) &&
                cell.ymd <= (startYmd < endYmd ? endYmd : startYmd);
              const selected =
                cell.ymd === draftStart ||
                cell.ymd === startYmd ||
                cell.ymd === endYmd ||
                Boolean(inCurrentRange);

              return (
                <PickerDay
                  key={cell.ymd}
                  type="button"
                  disabled={disabled}
                  $selected={selected}
                  onClick={() => {
                    if (!draftStart) {
                      setDraftStart(cell.ymd);
                      return;
                    }
                    const from = draftStart <= cell.ymd ? draftStart : cell.ymd;
                    const to = draftStart <= cell.ymd ? cell.ymd : draftStart;
                    onRangeChange(from, to);
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
