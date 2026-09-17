import { CircularProgress, Switch, TextField, useTheme } from '@mui/material';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { MOCK_WORKING_HOURS } from '@/modules/working-hours/fixtures';
import {
  Callout,
  DurationCustomField,
  DurationCustomHint,
  DurationCustomLabel,
  DurationCustomRow,
  FieldFull,
  FieldGrid,
  PrimarySaveButton,
  SectionLabel,
  SegmentButton,
  SegmentRow,
  SwitchRow,
  ZoneBadge,
  ZoneHead,
  ZonePanel,
  ZoneTitle,
} from '@/modules/working-hours/styles';
import type { SupportedFormat, VisitDurationMinutes, ZoneBFormState } from '@/modules/working-hours/types';
import { formatDisplayDate } from '@/modules/working-hours/utils/calendarGrid';

interface ZoneBPanelProps {
  form: ZoneBFormState;
  locale: string;
  isSaving: boolean;
  onChange: (patch: Partial<ZoneBFormState>) => void;
  onSaveClick: () => void;
  onVacationToggleOn: () => void;
}

const DURATIONS: VisitDurationMinutes[] = [20, 30, 45];

export const ZoneBPanel = ({
  form,
  locale,
  isSaving,
  onChange,
  onSaveClick,
  onVacationToggleOn,
}: ZoneBPanelProps) => {
  const { t } = useTranslation('workingHours');
  const theme = useTheme();
  const zoneBStart = MOCK_WORKING_HOURS.zoneBStartYmd;

  const formatOptions: { value: SupportedFormat; label: string }[] = [
    { value: 'offline', label: t('zoneB.formatOffline') },
    { value: 'online', label: t('zoneB.formatOnline') },
    { value: 'both', label: t('zoneB.formatBoth') },
  ];

  return (
    <ZonePanel>
      <ZoneHead>
        <ZoneBadge $tone="b">{t('zoneB.badge')}</ZoneBadge>
        <ZoneTitle>{t('zoneB.title')}</ZoneTitle>
      </ZoneHead>

      <Callout $tone="b">
        <IconInfoCircle size={18} color={theme.palette.primary.dark} />
        <span>
          {t('zoneB.callout', { date: formatDisplayDate(zoneBStart, locale) })}
        </span>
      </Callout>

      <FieldGrid>
        <TextField
          label={t('zoneB.start')}
          value={form.workStart}
          onChange={(event) => {
            onChange({ workStart: event.target.value });
          }}
        />
        <TextField
          label={t('zoneB.end')}
          value={form.workEnd}
          onChange={(event) => {
            onChange({ workEnd: event.target.value });
          }}
        />
        <FieldFull>
          <TextField
            fullWidth
            label={t('zoneB.lunch')}
            value={`${form.lunchStart}–${form.lunchEnd}`}
            onChange={(event) => {
              const [start, end] = event.target.value.split('–').map((part) => part.trim());
              onChange({
                lunchStart: start || form.lunchStart,
                lunchEnd: end || form.lunchEnd,
              });
            }}
          />
        </FieldFull>
        <FieldFull>
          <SectionLabel>{t('zoneB.duration')}</SectionLabel>
          <SegmentRow>
            {DURATIONS.map((minutes) => (
              <SegmentButton
                key={minutes}
                type="button"
                $active={form.durationMinutes === minutes && !form.customDuration}
                onClick={() => {
                  onChange({ durationMinutes: minutes, customDuration: undefined });
                }}
              >
                {minutes}
              </SegmentButton>
            ))}
          </SegmentRow>
          <DurationCustomRow>
            <DurationCustomLabel>{t('zoneB.durationCustom')}</DurationCustomLabel>
            <DurationCustomField
              size="small"
              type="number"
              placeholder="—"
              InputProps={{
                endAdornment: (
                  <DurationCustomHint>{t('zoneB.durationUnit')}</DurationCustomHint>
                ),
              }}
              value={form.customDuration ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                onChange({
                  customDuration: value ? Number(value) : undefined,
                });
              }}
            />
            <DurationCustomHint>{t('zoneB.durationCustomHint')}</DurationCustomHint>
          </DurationCustomRow>
        </FieldFull>
      </FieldGrid>

      <div>
        <SectionLabel>{t('zoneB.format')}</SectionLabel>
        <SegmentRow>
          {formatOptions.map((option) => (
            <SegmentButton
              key={option.value}
              type="button"
              $active={form.format === option.value}
              onClick={() => {
                onChange({ format: option.value });
              }}
            >
              {option.label}
            </SegmentButton>
          ))}
        </SegmentRow>
      </div>

      <div>
        <SectionLabel>{t('zoneB.price')}</SectionLabel>
        <TextField
          fullWidth
          value={t('zoneB.priceValue', { price: form.priceUah })}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '');
            onChange({ priceUah: Number(digits) || 0 });
          }}
          helperText={t('zoneB.priceHint')}
        />
      </div>

      <SwitchRow>
        <span>{t('zoneB.vacationToggle')}</span>
        <Switch
          checked={form.vacationDayOff}
          onChange={(_, checked) => {
            onChange({ vacationDayOff: checked });
            if (checked) {
              onVacationToggleOn();
            }
          }}
        />
      </SwitchRow>

      <PrimarySaveButton
        variant="contained"
        color="primary"
        disabled={isSaving}
        startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : undefined}
        onClick={onSaveClick}
      >
        {isSaving ? t('zoneB.saving') : t('zoneB.save')}
      </PrimarySaveButton>
    </ZonePanel>
  );
};
