import { useTranslation } from 'react-i18next';

import { StateMascot } from '@/components/StateMascot/StateMascot';
import {
  SavingDialog,
  SavingHint,
  SavingScrim,
  SavingTitle,
} from '@/modules/profile/styles';

const LIKA_SAVING = '/brand/lika-poses/lika3.png';

interface ProfileSavingOverlayProps {
  open: boolean;
}

export const ProfileSavingOverlay = ({ open }: ProfileSavingOverlayProps) => {
  const { t } = useTranslation('profile');

  if (!open) {
    return null;
  }

  return (
    <SavingScrim role="alertdialog" aria-busy="true" aria-live="polite">
      <SavingDialog>
        <StateMascot src={LIKA_SAVING} size={96} />
        <SavingTitle>{t('savingOverlay.title')}</SavingTitle>
        <SavingHint>{t('savingOverlay.hint')}</SavingHint>
      </SavingDialog>
    </SavingScrim>
  );
};
