import { Switch, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MOCK_WORKING_HOURS } from '@/modules/working-hours/fixtures';
import {
  Callout,
  FieldGrid,
  PrimarySaveButton,
  SegmentButton,
  SegmentRow,
  SwitchRow,
  ZoneBadge,
  ZoneHead,
  ZonePanel,
} from '@/modules/working-hours/styles';
import type { SupportedFormat, VisitDurationMinutes, ZoneBFormState } from '@/modules/working-hours/types';
import { formatDisplayDate } from '@/modules/working-hours/utils/calendarGrid';

interface ZoneBPanelProps {
  form: ZoneBFormState;
  locale: string;
  onChange: (patch: Partial<ZoneBFormState>) => void;
  onSaveClick: () => void;
  onVacationToggleOn: () => void;
}

const DURATIONS: VisitDurationMinutes[] = [20, 30, 45];

export const ZoneBPanel = ({
  form,
  locale,
  onChange,
  onSaveClick,
  onVacationToggleOn,
}: ZoneBPanelProps) => {
  const { t } = useTranslation('workingHours');
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
        <strong>{t('zoneB.title')}</strong>
      </ZoneHead>
      <Callout>
        {t('zoneB.callout', { date: formatDisplayDate(zoneBStart, locale) })}
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
        <TextField
          label={t('zoneB.lunch')}
          value={`${form.lunchStart} – ${form.lunchEnd}`}
          onChange={(event) => {
            const [start, end] = event.target.value.split('–').map((part) => part.trim());
            onChange({
              lunchStart: start || form.lunchStart,
              lunchEnd: end || form.lunchEnd,
            });
          }}
        />
        <TextField
          label={t('zoneB.price')}
          type="number"
          helperText={t('zoneB.priceHint')}
          value={form.priceUah}
          onChange={(event) => {
            onChange({ priceUah: Number(event.target.value) || 0 });
          }}
        />
      </FieldGrid>

      <strong>{t('zoneB.duration')}</strong>
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
      <TextField
        size="small"
        label={t('zoneB.durationCustom')}
        type="number"
        value={form.customDuration ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          onChange({
            customDuration: value ? Number(value) : undefined,
          });
        }}
      />

      <strong>{t('zoneB.format')}</strong>
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

      <PrimarySaveButton variant="contained" color="primary" onClick={onSaveClick}>
        {t('zoneB.save')}
      </PrimarySaveButton>
    </ZonePanel>
  );
};
