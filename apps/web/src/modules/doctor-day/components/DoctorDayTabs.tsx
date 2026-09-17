import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconClockHour4,
  IconUsers,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { DoctorDayTab } from '@/modules/doctor-day/types';
import { FilterTab, TabCount, TabLabel, TabRow } from '@/modules/doctor-day/styles';

interface DoctorDayTabsProps {
  active: DoctorDayTab;
  counts: Record<DoctorDayTab, number>;
  onChange: (tab: DoctorDayTab) => void;
}

const TAB_ICONS: Record<DoctorDayTab, ReactNode> = {
  visits: <IconCalendarEvent size={18} />,
  pending: <IconUsers size={18} />,
  free: <IconClockHour4 size={18} />,
  cancellations: <IconAlertTriangle size={18} />,
};

export const DoctorDayTabs = ({ active, counts, onChange }: DoctorDayTabsProps) => {
  const { t } = useTranslation('doctorDay');
  const tabs: DoctorDayTab[] = ['visits', 'pending', 'free', 'cancellations'];

  return (
    <TabRow>
      {tabs.map((tab) => (
        <FilterTab
          key={tab}
          type="button"
          $active={active === tab}
          onClick={() => {
            onChange(tab);
          }}
        >
          {TAB_ICONS[tab]}
          <div>
            <TabCount>{counts[tab]}</TabCount>
            <TabLabel>{t(`tabs.${tab}`)}</TabLabel>
          </div>
        </FilterTab>
      ))}
    </TabRow>
  );
};
