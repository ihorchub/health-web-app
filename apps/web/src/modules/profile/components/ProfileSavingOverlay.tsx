import { useTranslation } from 'react-i18next';

import {
  SavingDialog,
  SavingHint,
  SavingLika,
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
        <SavingLika src={LIKA_SAVING} alt="" />
        <SavingTitle>{t('savingOverlay.title')}</SavingTitle>
        <SavingHint>{t('savingOverlay.hint')}</SavingHint>
      </SavingDialog>
    </SavingScrim>
  );
};
