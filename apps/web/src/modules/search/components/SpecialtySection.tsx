import {
  IconBone,
  IconBrain,
  IconDots,
  IconEar,
  IconEye,
  IconGenderFemale,
  IconHeartRateMonitor,
  IconLungs,
  IconMoodSmile,
  IconPill,
  IconStethoscope,
  IconDroplet,
  IconUserHeart,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { ReferenceSpecialty } from '@/api/reference';
import {
  SectionTitle,
  SpecialtyCard,
  SpecialtyGrid,
  SpecialtyIcon,
  SpecialtyName,
} from '@/modules/search/styles';
import { styled } from '@mui/material';

const Wrap = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
}));

const ICONS: Record<string, ReactNode> = {
  family_doctor: <IconStethoscope size={22} stroke={1.75} />,
  cardiologist: <IconHeartRateMonitor size={22} stroke={1.75} />,
  dermatologist: <IconMoodSmile size={22} stroke={1.75} />,
  paediatrician: <IconMoodSmile size={22} stroke={1.75} />,
  neurologist: <IconBrain size={22} stroke={1.75} />,
  ophthalmologist: <IconEye size={22} stroke={1.75} />,
  orthopedist: <IconBone size={22} stroke={1.75} />,
  endocrinologist: <IconDroplet size={22} stroke={1.75} />,
  gastroenterologist: <IconPill size={22} stroke={1.75} />,
  gynecologist: <IconGenderFemale size={22} stroke={1.75} />,
  urologist: <IconUserHeart size={22} stroke={1.75} />,
  otolaryngologist: <IconEar size={22} stroke={1.75} />,
  psychiatrist: <IconBrain size={22} stroke={1.75} />,
  pulmonologist: <IconLungs size={22} stroke={1.75} />,
};

interface SpecialtySectionProps {
  specialties: ReferenceSpecialty[];
  activeSpecialty?: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onSelect: (specialtyId?: string) => void;
}

export const SpecialtySection = ({
  specialties,
  activeSpecialty,
  expanded,
  onToggleExpand,
  onSelect,
}: SpecialtySectionProps) => {
  const { t } = useTranslation('search');
  const visible = expanded ? specialties : specialties.slice(0, 3);

  return (
    <Wrap>
      <SectionTitle>{t('specialties.title')}</SectionTitle>
      <SpecialtyGrid>
        {visible.map((specialty) => (
          <SpecialtyCard
            key={specialty.id}
            type="button"
            $active={activeSpecialty === specialty.id}
            onClick={() => {
              onSelect(activeSpecialty === specialty.id ? undefined : specialty.id);
            }}
          >
            <SpecialtyIcon>
              {ICONS[specialty.id] ?? <IconStethoscope size={22} />}
            </SpecialtyIcon>
            <SpecialtyName>{t(`specialties.${specialty.id}`)}</SpecialtyName>
          </SpecialtyCard>
        ))}
        <SpecialtyCard type="button" onClick={onToggleExpand}>
          <SpecialtyIcon>
            <IconDots size={22} stroke={1.75} />
          </SpecialtyIcon>
          <SpecialtyName>
            {expanded ? t('specialties.collapse') : t('specialties.all')}
          </SpecialtyName>
        </SpecialtyCard>
      </SpecialtyGrid>
    </Wrap>
  );
};
