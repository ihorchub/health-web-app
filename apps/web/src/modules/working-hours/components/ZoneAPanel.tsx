import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { BulkCancelScope, ZoneAParams } from '@/modules/working-hours/types';
import {
  Callout,
  DangerOutlineButton,
  ParamDd,
  ParamDt,
  ParamList,
  ParamRow,
  RadioGroup,
  RadioRow,
  ZoneBadge,
  ZoneHead,
  ZonePanel,
} from '@/modules/working-hours/styles';

interface ZoneAPanelProps {
  params: ZoneAParams;
  bulkScope: BulkCancelScope;
  onBulkScopeChange: (scope: BulkCancelScope) => void;
  cancelReason: string;
  onCancelReasonChange: (value: string) => void;
  onBulkClick: () => void;
  onVacationClick: () => void;
}

export const ZoneAPanel = ({
  params,
  bulkScope,
  onBulkScopeChange,
  cancelReason,
  onCancelReasonChange,
  onBulkClick,
  onVacationClick,
}: ZoneAPanelProps) => {
  const { t } = useTranslation('workingHours');

  const scopes: BulkCancelScope[] = ['today', 'rest_of_day', 'rest_of_week', 'custom'];
  const scopeLabel: Record<BulkCancelScope, string> = {
    today: t('zoneA.scopeToday'),
    rest_of_day: t('zoneA.scopeRestDay'),
    rest_of_week: t('zoneA.scopeRestWeek'),
    custom: t('zoneA.scopeCustom'),
  };

  return (
    <ZonePanel>
      <ZoneHead>
        <ZoneBadge $tone="a">{t('zoneA.badge')}</ZoneBadge>
        <strong>{t('zoneA.title')}</strong>
      </ZoneHead>
      <Callout>{t('zoneA.callout')}</Callout>

      <strong>{t('zoneA.currentParams')}</strong>
      <ParamList>
        <ParamRow>
          <ParamDt>{t('zoneA.hours')}</ParamDt>
          <ParamDd>
            {t('zoneA.hoursValue', {
              start: params.workStart,
              end: params.workEnd,
              lunchStart: params.lunchStart,
              lunchEnd: params.lunchEnd,
            })}
          </ParamDd>
        </ParamRow>
        <ParamRow>
          <ParamDt>{t('zoneA.format')}</ParamDt>
          <ParamDd>{t(`format.${params.format}`)}</ParamDd>
        </ParamRow>
        <ParamRow>
          <ParamDt>{t('zoneA.duration')}</ParamDt>
          <ParamDd>{t('zoneA.durationValue', { minutes: params.durationMinutes })}</ParamDd>
        </ParamRow>
        <ParamRow>
          <ParamDt>{t('zoneA.price')}</ParamDt>
          <ParamDd>{t('zoneA.priceValue', { price: params.priceUah })}</ParamDd>
        </ParamRow>
      </ParamList>

      <strong>{t('zoneA.bulkTitle')}</strong>
      <RadioGroup>
        {scopes.map((scope) => (
          <RadioRow key={scope}>
            <input
              type="radio"
              name="bulkScope"
              checked={bulkScope === scope}
              onChange={() => {
                onBulkScopeChange(scope);
              }}
            />
            {scopeLabel[scope]}
          </RadioRow>
        ))}
      </RadioGroup>
      <TextField
        fullWidth
        multiline
        minRows={2}
        label={t('zoneA.cancelReasonLabel')}
        helperText={t('zoneA.cancelReasonHint')}
        placeholder={t('zoneA.cancelReasonPlaceholder')}
        value={cancelReason}
        onChange={(event) => {
          onCancelReasonChange(event.target.value);
        }}
      />
      <DangerOutlineButton variant="outlined" onClick={onBulkClick}>
        {t('zoneA.bulkButton')}
      </DangerOutlineButton>

      <strong>{t('zoneA.vacationTitle')}</strong>
      <Callout>{t('zoneA.vacationHint')}</Callout>
      <DangerOutlineButton variant="outlined" onClick={onVacationClick}>
        {t('zoneA.vacationCta')}
      </DangerOutlineButton>
    </ZonePanel>
  );
};
