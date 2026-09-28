import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StateMascot } from '@/components/StateMascot/StateMascot';
import { StateBody, StateBox, StateTitle } from '@/modules/patient-room/styles';

const LIKA_LOADING = '/brand/lika-poses/lika3.png';
const LIKA_EMPTY = '/brand/lika-poses/lika4.png';

interface CabinetStatePanelProps {
  variant: 'loading' | 'empty-upcoming' | 'empty-all';
  onFindDoctor?: () => void;
}

export const CabinetStatePanel = ({ variant, onFindDoctor }: CabinetStatePanelProps) => {
  const { t } = useTranslation('cabinet');

  const mascot = variant === 'loading' ? LIKA_LOADING : LIKA_EMPTY;
  const titleKey =
    variant === 'loading'
      ? 'upcoming.loadingTitle'
      : variant === 'empty-all'
        ? 'emptyAll.title'
        : 'upcoming.emptyTitle';
  const bodyKey =
    variant === 'loading'
      ? 'upcoming.loadingBody'
      : variant === 'empty-all'
        ? 'emptyAll.body'
        : 'upcoming.emptyBody';

  return (
    <StateBox aria-live={variant === 'loading' ? 'polite' : undefined}>
      <StateMascot src={mascot} />
      <StateTitle>{t(titleKey)}</StateTitle>
      <StateBody>{t(bodyKey)}</StateBody>
      {variant !== 'loading' && onFindDoctor ? (
        <Button variant="contained" color="primary" onClick={onFindDoctor}>
          {t('findDoctor')}
        </Button>
      ) : null}
    </StateBox>
  );
};
