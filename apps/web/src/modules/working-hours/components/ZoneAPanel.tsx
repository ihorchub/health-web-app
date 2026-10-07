import { IconBeach } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { ZoneDateRangeField } from '@/modules/working-hours/components/ZoneDateRangeField';
import type { BulkCancelScope, ZoneAParams } from '@/modules/working-hours/types';
import {
  ActionSection,
  DangerOutlineButton,
  FormSectionFirst,
  ManageColumn,
  ManageGrid,
  MetaColumn,
  MetaLabel,
  MetaList,
  MetaRow,
  MetaValue,
  RadioDot,
  RadioGroup,
  RadioRow,
  ReasonBlock,
  ReasonHint,
  ReasonTextField,
  SectionLabel,
  StatusPill,
  VacationActionButton,
  VacationCopy,
  VacationHead,
  VacationIcon,
  VacationSection,
  ZoneBadge,
  ZoneHead,
  ZoneHeadRow,
  ZoneIntro,
  ZonePanel,
  ZoneTitle,
} from '@/modules/working-hours/styles';

export type ZoneAVacationMode = 'add' | 'remove' | 'locked';

interface ZoneAPanelProps {
  params: ZoneAParams;
  locale: string;
  rangeStartYmd: string;
  rangeEndYmd: string;
  minYmd: string;
  maxYmd: string;
  todayShort: string;
  bulkScope: BulkCancelScope;
  onBulkScopeChange: (scope: BulkCancelScope) => void;
  onRangeChange: (startYmd: string, endYmd: string) => void;
  cancelReason: string;
  onCancelReasonChange: (value: string) => void;
  vacationMode: ZoneAVacationMode;
  onBulkClick: () => void;
  onVacationClick: () => void;
}

export const ZoneAPanel = ({
  params,
  locale,
  rangeStartYmd,
  rangeEndYmd,
  minYmd,
  maxYmd,
  todayShort,
  bulkScope,
  onBulkScopeChange,
  onRangeChange,
  cancelReason,
  onCancelReasonChange,
  vacationMode,
  onBulkClick,
  onVacationClick,
}: ZoneAPanelProps) => {
  const { t } = useTranslation('workingHours');
  const vacationEnabled = vacationMode !== 'locked';
  const isRemove = vacationMode === 'remove';

  const scopes: BulkCancelScope[] = ['today', 'rest_of_day', 'rest_of_week', 'custom'];
  const scopeLabel: Record<BulkCancelScope, string> = {
    today: t('zoneA.scopeToday', { date: todayShort }),
    rest_of_day: t('zoneA.scopeRestDay'),
    rest_of_week: t('zoneA.scopeRestWeek'),
    custom: t('zoneA.scopeCustom'),
  };

  return (
    <ZonePanel $tone="a">
      <ZoneHead>
        <ZoneHeadRow>
          <ZoneBadge $tone="a">{t('zoneA.badge')}</ZoneBadge>
          <StatusPill>{t('zoneA.statusActive')}</StatusPill>
        </ZoneHeadRow>
        <ZoneTitle>{t('zoneA.title')}</ZoneTitle>
        <ZoneIntro>{t('zoneA.callout')}</ZoneIntro>
      </ZoneHead>

      <ZoneDateRangeField
        startYmd={rangeStartYmd}
        endYmd={rangeEndYmd}
        minYmd={minYmd}
        maxYmd={maxYmd}
        locale={locale}
        onRangeChange={onRangeChange}
      />

      <FormSectionFirst>
        <SectionLabel>{t('zoneA.currentParams')}</SectionLabel>
        <MetaList>
          <MetaColumn>
            <MetaRow>
              <MetaLabel>{t('zoneA.metaHours')}</MetaLabel>
              <MetaValue>
                {params.workStart} – {params.workEnd}
              </MetaValue>
            </MetaRow>
            <MetaRow>
              <MetaLabel>{t('zoneA.metaLunch')}</MetaLabel>
              <MetaValue>
                {params.lunchStart} – {params.lunchEnd}
              </MetaValue>
            </MetaRow>
          </MetaColumn>
          <MetaColumn>
            <MetaRow>
              <MetaLabel>{t('zoneA.metaDuration')}</MetaLabel>
              <MetaValue>{t('zoneA.durationValue', { minutes: params.durationMinutes })}</MetaValue>
            </MetaRow>
            <MetaRow>
              <MetaLabel>{t('zoneA.metaFormat')}</MetaLabel>
              <MetaValue $italic>{t(`format.${params.format}`)}</MetaValue>
            </MetaRow>
            <MetaRow>
              <MetaLabel>{t('zoneA.metaPrice')}</MetaLabel>
              <MetaValue>{t('zoneA.priceValue', { price: params.priceUah })}</MetaValue>
            </MetaRow>
          </MetaColumn>
        </MetaList>
      </FormSectionFirst>

      <ActionSection>
        <ManageGrid>
          <ManageColumn>
            <SectionLabel>{t('zoneA.manageTitle')}</SectionLabel>
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
          </ManageColumn>

          <ReasonBlock>
            <SectionLabel>{t('zoneA.cancelReasonLabel')}</SectionLabel>
            <ReasonTextField
              fullWidth
              size="small"
              multiline
              minRows={4}
              placeholder={t('zoneA.cancelReasonPlaceholder')}
              value={cancelReason}
              onChange={(event) => {
                onCancelReasonChange(event.target.value);
              }}
            />
          </ReasonBlock>
        </ManageGrid>

        <DangerOutlineButton variant="outlined" onClick={onBulkClick}>
          {t('zoneA.bulkButton')}
        </DangerOutlineButton>

        <VacationSection>
          <VacationCopy>
            <VacationHead>
              <VacationIcon>
                <IconBeach size={18} aria-hidden />
              </VacationIcon>
              {t(isRemove ? 'zoneA.vacationRemoveTitle' : 'zoneA.vacationTitle')}
            </VacationHead>
            <ReasonHint>
              {isRemove
                ? t('zoneA.vacationRemoveHint')
                : vacationEnabled
                  ? t('zoneA.vacationReadyHint')
                  : t('zoneA.vacationLockedHint')}
            </ReasonHint>
          </VacationCopy>
          <VacationActionButton disabled={!vacationEnabled} onClick={onVacationClick}>
            {t(isRemove ? 'zoneA.vacationRemoveCta' : 'zoneA.vacationCta')}
          </VacationActionButton>
        </VacationSection>
      </ActionSection>
    </ZonePanel>
  );
};
