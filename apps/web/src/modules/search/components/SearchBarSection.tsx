import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import {
  MobileFilterButton,
  MobileFilterLabel,
  SearchBar,
  SearchClearButton,
  SearchInput,
  SearchSubmit,
  SearchSubmitLabel,
} from '@/modules/search/styles';

interface SearchBarSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onOpenFilters: () => void;
}

export const SearchBarSection = ({
  value,
  onChange,
  onSubmit,
  onClear,
  onOpenFilters,
}: SearchBarSectionProps) => {
  const { t } = useTranslation('search');
  const hasValue = value.trim().length > 0;

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
      {hasValue ? (
        <SearchClearButton
          type="button"
          aria-label={t('search.clear')}
          onClick={onClear}
        >
          <IconX size={18} stroke={1.75} />
        </SearchClearButton>
      ) : null}
      <MobileFilterButton
        type="button"
        variant="outlined"
        color="inherit"
        startIcon={<IconAdjustmentsHorizontal size={18} />}
        onClick={onOpenFilters}
      >
        <MobileFilterLabel>{t('search.filtersOpen')}</MobileFilterLabel>
      </MobileFilterButton>
      <SearchSubmit type="submit" variant="contained" color="primary">
        <SearchSubmitLabel>{t('search.submit')}</SearchSubmitLabel>
        <IconSearch size={18} stroke={2} aria-hidden />
      </SearchSubmit>
    </SearchBar>
  );
};
