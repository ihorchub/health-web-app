import { useTranslation } from 'react-i18next';

import {
  PlannedScheduleAction,
  PlannedScheduleBody,
  PlannedScheduleCard,
  PlannedScheduleCards,
  PlannedScheduleMeta,
  PlannedScheduleRange,
  PlannedSchedulesHead,
  PlannedSchedulesHint,
  PlannedSchedulesSection as Section,
  PlannedSchedulesTitle,
} from '@/modules/working-hours/styles';
import type { ZoneBPlannedRange } from '@/modules/working-hours/types';

interface PlannedSchedulesSectionProps {
  ranges: ZoneBPlannedRange[];
  workingDaysLabel: string;
  onRangeClick: (from: string, to: string) => void;
}

export const PlannedSchedulesSection = ({
  ranges,
  workingDaysLabel,
  onRangeClick,
}: PlannedSchedulesSectionProps) => {
  const { t } = useTranslation('workingHours');

  if (ranges.length === 0) {
    return null;
  }

  return (
    <Section>
      <PlannedSchedulesHead>
        <PlannedSchedulesTitle>{t('plannedSchedules.title')}</PlannedSchedulesTitle>
        <PlannedSchedulesHint>{t('plannedSchedules.hint')}</PlannedSchedulesHint>
      </PlannedSchedulesHead>

      <PlannedScheduleCards>
        {ranges.map((range) => (
          <PlannedScheduleCard
            key={`${range.from}-${range.to}`}
            type="button"
            onClick={() => {
              onRangeClick(range.from, range.to);
            }}
          >
            <PlannedScheduleBody>
              <PlannedScheduleRange>{range.label}</PlannedScheduleRange>
              {range.dayOff ? (
                <PlannedScheduleMeta>{t('plannedSchedules.dayOff')}</PlannedScheduleMeta>
              ) : (
                <>
                  <PlannedScheduleMeta>
                    {workingDaysLabel} · {range.plan.workStart}–{range.plan.workEnd} ·{' '}
                    {t('zoneA.durationValue', { minutes: range.plan.durationMinutes })}
                  </PlannedScheduleMeta>
                  <PlannedScheduleMeta>
                    {t(`format.${range.plan.format}`)} ·{' '}
                    {t('zoneA.priceValue', { price: range.plan.priceUah })}
                  </PlannedScheduleMeta>
                </>
              )}
            </PlannedScheduleBody>
            <PlannedScheduleAction>{t('plannedSchedules.edit')}</PlannedScheduleAction>
          </PlannedScheduleCard>
        ))}
      </PlannedScheduleCards>
    </Section>
  );
};
