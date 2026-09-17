import {
  IconDots,
  IconHeartRateMonitor,
  IconMoodSmile,
  IconStethoscope,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useGetReferenceSpecialties } from '@/api/reference';
import {
  SectionHead,
  SectionLink,
  SectionTitle,
  SpecialtyGrid,
  SpecialtyTile,
  SpecialtyTileIcon,
  SpecialtyTileLabel,
} from '@/modules/patient-room/styles';
import { AppRoute } from '@/utils/routeUtils/routes';

const ICONS: Record<string, ReactNode> = {
  family_doctor: <IconStethoscope size={22} stroke={1.75} />,
  cardiologist: <IconHeartRateMonitor size={22} stroke={1.75} />,
  dermatologist: <IconMoodSmile size={22} stroke={1.75} />,
  paediatrician: <IconMoodSmile size={22} stroke={1.75} />,
};

export const CabinetSpecialties = () => {
  const { t } = useTranslation(['cabinet', 'search']);
  const navigate = useNavigate();
  const specialtiesQuery = useGetReferenceSpecialties();
  const items = specialtiesQuery.data?.items?.slice(0, 3) ?? [];

  return (
    <section>
      <SectionHead>
        <SectionTitle>{t('cabinet:specialties.title')}</SectionTitle>
        <SectionLink
          type="button"
          onClick={() => {
            void navigate(AppRoute.HOME);
          }}
        >
          {t('cabinet:specialties.all')}
        </SectionLink>
      </SectionHead>

      <SpecialtyGrid>
        {items.map((specialty) => (
          <SpecialtyTile
            key={specialty.id}
            type="button"
            onClick={() => {
              void navigate(AppRoute.HOME);
            }}
          >
            <SpecialtyTileIcon>
              {ICONS[specialty.id] ?? <IconStethoscope size={22} />}
            </SpecialtyTileIcon>
            <SpecialtyTileLabel>{t(`search:specialties.${specialty.id}`)}</SpecialtyTileLabel>
          </SpecialtyTile>
        ))}
        <SpecialtyTile
          type="button"
          onClick={() => {
            void navigate(AppRoute.HOME);
          }}
        >
          <SpecialtyTileIcon>
            <IconDots size={22} stroke={1.75} />
          </SpecialtyTileIcon>
          <SpecialtyTileLabel>{t('search:specialties.all')}</SpecialtyTileLabel>
        </SpecialtyTile>
      </SpecialtyGrid>
    </section>
  );
};
