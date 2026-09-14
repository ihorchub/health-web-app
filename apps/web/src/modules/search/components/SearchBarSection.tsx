import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  MobileFilterButton,
  SearchBar,
  SearchInput,
  SearchSubmit,
} from '@/modules/search/styles';

interface SearchBarSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOpenFilters: () => void;
}

export const SearchBarSection = ({
  value,
  onChange,
  onSubmit,
  onOpenFilters,
}: SearchBarSectionProps) => {
  const { t } = useTranslation('search');

  return (
    <SearchBar
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <IconSearch size={20} stroke={1.75} aria-hidden />
      <SearchInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={t('search.placeholder')}
        aria-label={t('search.placeholder')}
      />
      <MobileFilterButton
        type="button"
        variant="outlined"
        color="inherit"
        startIcon={<IconAdjustmentsHorizontal size={18} />}
        onClick={onOpenFilters}
      >
        {t('search.filtersOpen')}
      </MobileFilterButton>
      <SearchSubmit type="submit" variant="contained" color="primary">
        {t('search.submit')}
      </SearchSubmit>
    </SearchBar>
  );
};
