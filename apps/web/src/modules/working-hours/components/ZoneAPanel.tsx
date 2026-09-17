import {
  IconClock,
  IconCurrencyHryvnia,
  IconFolder,
  IconHourglass,
  IconInfoCircle,
  IconLock,
} from '@tabler/icons-react';
import { TextField, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { BulkCancelScope, ZoneAParams } from '@/modules/working-hours/types';
import {
  BulkSection,
  Callout,
  DangerOutlineButton,
  ParamList,
  ParamRow,
  RadioDot,
  RadioGroup,
  RadioRow,
  ReasonBlock,
  ReasonHint,
  SectionLabel,
  SoftButton,
  VacationBlock,
  VacationHead,
  ZoneBadge,
  ZoneHead,
  ZonePanel,
  ZoneTitle,
} from '@/modules/working-hours/styles';

interface ZoneAPanelProps {
  params: ZoneAParams;
  todayShort: string;
  bulkScope: BulkCancelScope;
  onBulkScopeChange: (scope: BulkCancelScope) => void;
  cancelReason: string;
  onCancelReasonChange: (value: string) => void;
  vacationEnabled: boolean;
  onBulkClick: () => void;
  onVacationClick: () => void;
}

export const ZoneAPanel = ({
  params,
  todayShort,
  bulkScope,
  onBulkScopeChange,
  cancelReason,
  onCancelReasonChange,
  vacationEnabled,
  onBulkClick,
  onVacationClick,
}: ZoneAPanelProps) => {
  const { t } = useTranslation('workingHours');
  const theme = useTheme();
  const muted = theme.palette.text.secondary;
  const disabled = theme.palette.text.disabled;

  const scopes: BulkCancelScope[] = ['today', 'rest_of_day', 'rest_of_week', 'custom'];
  const scopeLabel: Record<BulkCancelScope, string> = {
    today: t('zoneA.scopeToday', { date: todayShort }),
    rest_of_day: t('zoneA.scopeRestDay'),
    rest_of_week: t('zoneA.scopeRestWeek'),
    custom: t('zoneA.scopeCustom'),
  };

  return (
    <ZonePanel>
      <ZoneHead>
        <ZoneBadge $tone="a">{t('zoneA.badge')}</ZoneBadge>
        <ZoneTitle>{t('zoneA.title')}</ZoneTitle>
        <IconLock size={18} color={muted} />
      </ZoneHead>

      <Callout $tone="a">
        <IconInfoCircle size={18} color={theme.palette.text.primary} />
        <span>{t('zoneA.callout')}</span>
      </Callout>

      <div>
        <SectionLabel>{t('zoneA.currentParams')}</SectionLabel>
        <ParamList>
          <ParamRow>
            <IconClock size={18} color={muted} />
            <span>
              {t('zoneA.hoursValue', {
                start: params.workStart,
                end: params.workEnd,
                lunchStart: params.lunchStart,
                lunchEnd: params.lunchEnd,
              })}
            </span>
          </ParamRow>
          <ParamRow>
            <IconFolder size={18} color={muted} />
            <span>{t(`format.${params.format}`)}</span>
          </ParamRow>
          <ParamRow>
            <IconHourglass size={18} color={muted} />
            <span>{t('zoneA.durationValue', { minutes: params.durationMinutes })}</span>
          </ParamRow>
          <ParamRow>
            <IconCurrencyHryvnia size={18} color={muted} />
            <span>{t('zoneA.priceValue', { price: params.priceUah })}</span>
          </ParamRow>
        </ParamList>
      </div>

      <BulkSection>
        <SectionLabel>{t('zoneA.bulkTitle')}</SectionLabel>
        <RadioGroup>
          {scopes.map((scope) => (
            <RadioRow
              key={scope}
              $active={bulkScope === scope}
              onClick={() => {
                onBulkScopeChange(scope);
              }}
            >
              <RadioDot $active={bulkScope === scope} />
              <input
                type="radio"
                name="bulkScope"
                checked={bulkScope === scope}
                onChange={() => {
                  onBulkScopeChange(scope);
                }}
                hidden
              />
              {scopeLabel[scope]}
            </RadioRow>
          ))}
        </RadioGroup>

        <ReasonBlock>
          <SectionLabel>{t('zoneA.cancelReasonLabel')}</SectionLabel>
          <ReasonHint>{t('zoneA.cancelReasonHint')}</ReasonHint>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder={t('zoneA.cancelReasonPlaceholder')}
            value={cancelReason}
            onChange={(event) => {
              onCancelReasonChange(event.target.value);
            }}
          />
        </ReasonBlock>
      </BulkSection>

      <VacationBlock $disabled={!vacationEnabled}>
        <VacationHead>
          <IconLock size={16} color={vacationEnabled ? muted : disabled} />
          {t('zoneA.vacationTitle')}
        </VacationHead>
        <ReasonHint>{t('zoneA.vacationHint')}</ReasonHint>
        <SoftButton
          variant="contained"
          color="inherit"
          disabled={!vacationEnabled}
          onClick={onVacationClick}
        >
          {t('zoneA.vacationCta')}
        </SoftButton>
      </VacationBlock>

      <DangerOutlineButton variant="outlined" onClick={onBulkClick}>
        {t('zoneA.bulkButton')}
      </DangerOutlineButton>
    </ZonePanel>
  );
};
