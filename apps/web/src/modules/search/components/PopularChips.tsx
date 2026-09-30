import { useTranslation } from 'react-i18next';

import { ChipButton, PopularLabel, PopularRow } from '@/modules/search/styles';

const CHIPS = [
  { key: 'family', specialty: 'family_doctor' },
  { key: 'dermatologist', specialty: 'dermatologist' },
  { key: 'paediatrician', specialty: 'paediatrician' },
  { key: 'neurologist', specialty: 'neurologist' },
  { key: 'gynecologist', specialty: 'gynecologist' },
  { key: 'cardiologist', specialty: 'cardiologist' },
] as const;

interface PopularChipsProps {
  activeSpecialty?: string;
  activeQuery?: string;
  onSelect: (payload: { specialty?: string; q?: string }) => void;
}

export const PopularChips = ({
  activeSpecialty,
  onSelect,
}: PopularChipsProps) => {
  const { t } = useTranslation('search');

  return (
    <PopularRow>
      <PopularLabel>{t('popular.label')}</PopularLabel>
      {CHIPS.map((chip) => {
        const active = chip.specialty === activeSpecialty;

        return (
          <ChipButton
            key={chip.key}
            type="button"
            $active={active}
            onClick={() => {
              onSelect({
                specialty: active ? undefined : chip.specialty,
                q: undefined,
              });
            }}
          >
            {t(`popular.${chip.key}`)}
          </ChipButton>
        );
      })}
    </PopularRow>
  );
};
