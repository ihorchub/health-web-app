import { CircularProgress } from '@mui/material';
import { IconPlus, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { todayDoctorDayYmd } from '@/modules/doctor-day/utils/mapDashboard';
import { ZoneDateField } from '@/modules/working-hours/components/ZoneDateField';
import {
  ConstructorDaysBody,
  ConstructorDaysHead,
  ConstructorExceptBody,
  ConstructorExceptHead,
  ConstructorSplit,
  DurationCustomField,
  DurationCustomHint,
  DurationCustomLabel,
  DurationCustomRow,
  DurationSegmentButton,
  DurationSegmentRow,
  ExceptionBadge,
  FormSection,
  FormSectionFirst,
  FormatPriceRow,
  HoursRow,
  PeriodDash,
  PeriodFieldsRow,
  PrimaryOutlineButton,
  PrimarySaveButton,
  PromoBlock,
  PromoClearButton,
  PromoFieldsRow,
  ReasonHint,
  SectionLabel,
  SegmentButton,
  SegmentRow,
  WeekdayChip,
  WeekdayChipRow,
  ZoneBadge,
  ZoneHead,
  ZoneHeadRow,
  ZoneIntro,
  ZonePanel,
  ZoneTextField,
  ZoneTitle,
} from '@/modules/working-hours/styles';
import type {
  SupportedFormat,
  VisitDurationMinutes,
  ZoneBFormState,
} from '@/modules/working-hours/types';
import {
  formatDisplayDate,
  WEEKDAY_KEYS,
  type WorkingDaysSelection,
} from '@/modules/working-hours/utils/calendarGrid';
import { styled } from '@/theme/styled';

const ExceptionList = styled('ul')(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

const ExceptionRow = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minHeight: 32,
  padding: theme.spacing(0.5, 0.75),
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxSizing: 'border-box',
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.primary,
}));

const ExceptionRemove = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  marginLeft: 'auto',
  border: 'none',
  borderRadius: 6,
  background: 'none',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  flexShrink: 0,

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

const SplitBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

interface ZoneBExceptionItem {
  ymd: string;
  label: string;
}

interface ZoneBPanelProps {
  form: ZoneBFormState;
  locale: string;
  periodStartYmd: string;
  periodEndYmd: string;
  minYmd: string;
  maxYmd: string;
  isSaving: boolean;
  workingDays: WorkingDaysSelection;
  exceptions: ZoneBExceptionItem[];
  exceptionPickMode: boolean;
  onChange: (patch: Partial<ZoneBFormState>) => void;
  onPeriodStartPick: (ymd: string) => void;
  onPeriodEndPick: (ymd: string) => void;
  onWorkingDayToggle: (key: keyof WorkingDaysSelection) => void;
  onStartExceptionPick: () => void;
  onCancelExceptionPick: () => void;
  onChangeExceptionDate: (fromYmd: string, toYmd: string) => void;
  onRemoveException: (ymd: string) => void;
  onSaveClick: () => void;
}

const DURATIONS: VisitDurationMinutes[] = [20, 30, 45];

export const ZoneBPanel = ({
  form,
  locale,
  periodStartYmd,
  periodEndYmd,
  minYmd,
  maxYmd,
  isSaving,
  workingDays,
  exceptions,
  exceptionPickMode,
  onChange,
  onPeriodStartPick,
  onPeriodEndPick,
  onWorkingDayToggle,
  onStartExceptionPick,
  onCancelExceptionPick,
  onChangeExceptionDate,
  onRemoveException,
  onSaveClick,
}: ZoneBPanelProps) => {
  const { t } = useTranslation('workingHours');

  const formatOptions: { value: SupportedFormat; label: string }[] = [
    { value: 'offline', label: t('zoneB.formatOffline') },
    { value: 'online', label: t('zoneB.formatOnline') },
    { value: 'both', label: t('zoneB.formatBoth') },
  ];

  return (
    <ZonePanel $tone="b">
      <ZoneHead>
        <ZoneHeadRow>
          <ZoneBadge $tone="b">{t('zoneB.badge')}</ZoneBadge>
        </ZoneHeadRow>
        <ZoneTitle $tone="b">{t('zoneB.title')}</ZoneTitle>
        <ZoneIntro>{t('zoneB.intro')}</ZoneIntro>
      </ZoneHead>

      <FormSectionFirst>
        <SectionLabel>{t('zoneB.periodTitle')}</SectionLabel>
        <PeriodFieldsRow>
          <ZoneDateField
            label={formatDisplayDate(periodStartYmd, locale)}
            valueYmd={periodStartYmd}
            minYmd={minYmd}
            maxYmd={periodEndYmd < maxYmd ? periodEndYmd : maxYmd}
            onPick={onPeriodStartPick}
          />
          <PeriodDash>—</PeriodDash>
          <ZoneDateField
            label={formatDisplayDate(periodEndYmd, locale)}
            valueYmd={periodEndYmd}
            minYmd={periodStartYmd > minYmd ? periodStartYmd : minYmd}
            maxYmd={maxYmd}
            onPick={onPeriodEndPick}
          />
        </PeriodFieldsRow>
      </FormSectionFirst>

      <FormSection>
        <SectionLabel>{t('zoneB.hoursTitle')}</SectionLabel>
        <HoursRow>
          <ZoneTextField
            size="small"
            label={t('zoneB.start')}
            value={form.workStart}
            onChange={(event) => {
              onChange({ workStart: event.target.value });
            }}
          />
          <ZoneTextField
            size="small"
            label={t('zoneB.end')}
            value={form.workEnd}
            onChange={(event) => {
              onChange({ workEnd: event.target.value });
            }}
          />
          <ZoneTextField
            size="small"
            label={t('zoneB.lunchStart')}
            value={form.lunchStart}
            onChange={(event) => {
              onChange({ lunchStart: event.target.value });
            }}
          />
          <ZoneTextField
            size="small"
            label={t('zoneB.lunchEnd')}
            value={form.lunchEnd}
            onChange={(event) => {
              onChange({ lunchEnd: event.target.value });
            }}
          />
        </HoursRow>
      </FormSection>

      <FormSection>
        <SectionLabel>{t('zoneB.duration')}</SectionLabel>
        <DurationCustomRow>
          <DurationSegmentRow>
            {DURATIONS.map((minutes) => (
              <DurationSegmentButton
                key={minutes}
                type="button"
                $active={form.durationMinutes === minutes && !form.customDuration}
                onClick={() => {
                  onChange({ durationMinutes: minutes, customDuration: undefined });
                }}
              >
                {minutes}
              </DurationSegmentButton>
            ))}
          </DurationSegmentRow>
          <DurationCustomLabel>{t('zoneB.durationCustom')}</DurationCustomLabel>
          <DurationCustomField
            size="small"
            type="number"
            placeholder="—"
            slotProps={{
              input: {
                endAdornment: (
                  <DurationCustomHint>{t('zoneB.durationUnit')}</DurationCustomHint>
                ),
              },
            }}
            value={form.customDuration ?? ''}
            onChange={(event) => {
              const value = event.target.value;
              onChange({
                customDuration: value ? Number(value) : undefined,
              });
            }}
          />
        </DurationCustomRow>
      </FormSection>

      <FormSection>
        <ConstructorSplit>
          <ConstructorDaysHead>
            <SectionLabel>{t('zoneB.workingDaysTitle')}</SectionLabel>
          </ConstructorDaysHead>

          <ConstructorExceptHead>
            <SectionLabel>{t('zoneB.exceptionsTitle')}</SectionLabel>
            {exceptionPickMode ? (
              <PrimaryOutlineButton onClick={onCancelExceptionPick}>
                {t('zoneB.exceptionsPickCancel')}
              </PrimaryOutlineButton>
            ) : (
              <PrimaryOutlineButton
                startIcon={<IconPlus size={14} />}
                onClick={onStartExceptionPick}
              >
                {t('zoneB.exceptionsAdd')}
              </PrimaryOutlineButton>
            )}
          </ConstructorExceptHead>

          <ConstructorDaysBody>
            <WeekdayChipRow>
              {WEEKDAY_KEYS.map((key) => (
                <WeekdayChip
                  key={key}
                  type="button"
                  $active={workingDays[key]}
                  onClick={() => {
                    onWorkingDayToggle(key);
                  }}
                >
                  {t(`zoneB.weekday.${key}`)}
                </WeekdayChip>
              ))}
            </WeekdayChipRow>
          </ConstructorDaysBody>

          <ConstructorExceptBody>
            {exceptionPickMode ? (
              <ReasonHint>{t('zoneB.exceptionsPickHint')}</ReasonHint>
            ) : null}
            {exceptions.length > 0 ? (
              <ExceptionList>
                {exceptions.map((item) => (
                  <ExceptionRow key={item.ymd}>
                    <ZoneDateField
                      label={item.label}
                      valueYmd={item.ymd}
                      minYmd={minYmd}
                      maxYmd={maxYmd}
                      iconStart
                      compact
                      onPick={(ymd) => {
                        onChangeExceptionDate(item.ymd, ymd);
                      }}
                    />
                    <ExceptionBadge>{t('zoneB.exceptionKindDayOff')}</ExceptionBadge>
                    <ExceptionRemove
                      type="button"
                      aria-label={t('zoneB.exceptionRemove')}
                      onClick={() => {
                        onRemoveException(item.ymd);
                      }}
                    >
                      <IconX size={14} />
                    </ExceptionRemove>
                  </ExceptionRow>
                ))}
              </ExceptionList>
            ) : null}
          </ConstructorExceptBody>
        </ConstructorSplit>
      </FormSection>

      <FormSection>
        <FormatPriceRow>
          <SplitBlock>
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
          </SplitBlock>
          <SplitBlock>
            <SectionLabel>{t('zoneB.price')}</SectionLabel>
            <ZoneTextField
              size="small"
              fullWidth
              value={t('zoneB.priceValue', { price: form.priceUah })}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '');
                onChange({ priceUah: Number(digits) || 0 });
              }}
            />
          </SplitBlock>
        </FormatPriceRow>

        <PromoBlock>
          <SectionLabel>{t('zoneB.promoTitle')}</SectionLabel>
          <ReasonHint>{t('zoneB.promoHint')}</ReasonHint>
          <PromoFieldsRow>
            <ZoneTextField
              size="small"
              fullWidth
              label={t('zoneB.promoPrice')}
              value={
                form.promoPriceUah != null
                  ? t('zoneB.priceValue', { price: form.promoPriceUah })
                  : ''
              }
              placeholder={t('zoneB.promoEmpty')}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '');
                onChange({
                  promoPriceUah: digits ? Number(digits) : null,
                  promoValidUntil:
                    digits && !form.promoValidUntil
                      ? maxYmd
                      : form.promoValidUntil,
                });
              }}
            />
            <div>
              <SectionLabel>{t('zoneB.promoUntil')}</SectionLabel>
              <ZoneDateField
                label={
                  form.promoValidUntil
                    ? formatDisplayDate(form.promoValidUntil, locale)
                    : t('zoneB.promoPickUntil')
                }
                valueYmd={form.promoValidUntil ?? maxYmd}
                minYmd={todayDoctorDayYmd()}
                maxYmd={maxYmd}
                onPick={(ymd) => {
                  onChange({
                    promoValidUntil: ymd,
                    promoPriceUah: form.promoPriceUah ?? form.priceUah,
                  });
                }}
              />
            </div>
          </PromoFieldsRow>
          {form.promoPriceUah != null || form.promoValidUntil ? (
            <PromoClearButton
              type="button"
              onClick={() => {
                onChange({ promoPriceUah: null, promoValidUntil: null });
              }}
            >
              {t('zoneB.promoClear')}
            </PromoClearButton>
          ) : null}
        </PromoBlock>
      </FormSection>

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
