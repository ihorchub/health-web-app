import { useTranslation } from 'react-i18next';

import { ChipButton, PopularLabel, PopularRow } from '@/modules/search/styles';

const CHIPS = [
  { key: 'family', specialty: 'family_doctor' },
  { key: 'dermatologist', specialty: 'dermatologist' },
  { key: 'paediatrician', specialty: 'paediatrician' },
  { key: 'neurologist', q: 'невролог' },
  { key: 'gynecologist', q: 'гінеколог' },
  { key: 'cardiologist', specialty: 'cardiologist' },
] as const;

interface PopularChipsProps {
  activeSpecialty?: string;
  activeQuery?: string;
  onSelect: (payload: { specialty?: string; q?: string }) => void;
}

export const PopularChips = ({
  activeSpecialty,
  activeQuery,
  onSelect,
}: PopularChipsProps) => {
  const { t } = useTranslation('search');

  return (
    <PopularRow>
      <PopularLabel>{t('popular.label')}</PopularLabel>
      {CHIPS.map((chip) => {
        const active =
          ('specialty' in chip && chip.specialty === activeSpecialty) ||
          ('q' in chip && chip.q === activeQuery);

        return (
          <ChipButton
            key={chip.key}
            type="button"
            $active={active}
            onClick={() => {
              if ('specialty' in chip) {
                onSelect({ specialty: chip.specialty, q: undefined });
              } else {
                onSelect({ specialty: undefined, q: chip.q });
              }
            }}
          >
            {t(`popular.${chip.key}`)}
          </ChipButton>
        );
      })}
    </PopularRow>
  );
};
