import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconClockHour4,
  IconLayoutGrid,
} from '@tabler/icons-react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { DoctorDayTab } from '@/modules/doctor-day/types';
import {
  FilterTab,
  TabCopy,
  TabCount,
  TabIcon,
  TabLabel,
  TabRow,
} from '@/modules/doctor-day/styles';

interface DoctorDayTabsProps {
  active: DoctorDayTab;
  counts: Record<DoctorDayTab, number>;
  onChange: (tab: DoctorDayTab) => void;
}

const TAB_META: Record<DoctorDayTab, { tone: 'green' | 'orange' | 'red'; icon: ReactNode }> = {
  visits: {
    tone: 'green',
    icon: <IconCalendarEvent size={16} stroke={2} />,
  },
  pending: {
    tone: 'orange',
    icon: <IconClockHour4 size={16} stroke={2} />,
  },
  free: {
    tone: 'green',
    icon: <IconLayoutGrid size={16} stroke={2} />,
  },
  cancellations: {
    tone: 'red',
    icon: <IconAlertTriangle size={16} stroke={2} />,
  },
};

export const DoctorDayTabs = ({ active, counts, onChange }: DoctorDayTabsProps) => {
  const { t } = useTranslation('doctorDay');
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const tabs: DoctorDayTab[] = ['visits', 'pending', 'free', 'cancellations'];

  return (
    <TabRow>
      {tabs.map((tab) => {
        const meta = TAB_META[tab];
        const labelKey = isCompact ? `tabs.${tab}Short` : `tabs.${tab}`;

        return (
          <FilterTab
            key={tab}
            type="button"
            $active={active === tab}
            onClick={() => {
              onChange(tab);
            }}
          >
            <TabIcon $tone={meta.tone}>{meta.icon}</TabIcon>
            <TabCopy>
              <TabLabel>{t(labelKey)}</TabLabel>
              <TabCount $tone={meta.tone}>{counts[tab]}</TabCount>
            </TabCopy>
          </FilterTab>
        );
      })}
    </TabRow>
  );
};
