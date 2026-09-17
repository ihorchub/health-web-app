import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconClockHour4,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { MOCK_METRICS } from '@/modules/doctor-day/fixtures';
import {
  MetricCard,
  MetricIcon,
  MetricLabel,
  MetricsRow,
  MetricValue,
} from '@/modules/doctor-day/styles';

export const DoctorDayMetrics = () => {
  const { t } = useTranslation('doctorDay');

  const items = [
    {
      key: 'visitsToday',
      value: MOCK_METRICS.visitsToday,
      tone: 'green' as const,
      icon: <IconCalendarEvent size={22} />,
    },
    {
      key: 'pending',
      value: MOCK_METRICS.pendingDecisions,
      tone: 'orange' as const,
      icon: <IconUsers size={22} />,
    },
    {
      key: 'freeHours',
      value: MOCK_METRICS.freeHoursToday,
      tone: 'teal' as const,
      icon: <IconClockHour4 size={22} />,
    },
    {
      key: 'cancellations7d',
      value: MOCK_METRICS.cancellations7d,
      tone: 'red' as const,
      icon: <IconAlertTriangle size={22} />,
    },
  ];

  return (
    <MetricsRow>
      {items.map((item) => (
        <MetricCard key={item.key}>
          <MetricIcon $tone={item.tone}>{item.icon}</MetricIcon>
          <div>
            <MetricValue>{item.value}</MetricValue>
            <MetricLabel>{t(`metrics.${item.key}`)}</MetricLabel>
          </div>
        </MetricCard>
      ))}
    </MetricsRow>
  );
};
