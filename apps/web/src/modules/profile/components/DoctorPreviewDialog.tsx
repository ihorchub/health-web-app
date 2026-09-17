import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';

import { Avatar, FieldValue, HeroMeta, HeroName } from '@/modules/profile/styles';
import type { DoctorProfileData } from '@/modules/profile/types';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

interface DoctorPreviewDialogProps {
  open: boolean;
  profile: DoctorProfileData;
  cityName: string;
  clinicName: string;
  onClose: () => void;
}

export const DoctorPreviewDialog = ({
  open,
  profile,
  cityName,
  clinicName,
  onClose,
}: DoctorPreviewDialogProps) => {
  const { t, i18n } = useTranslation(['profile', 'search']);

  const bio = pickLocalizedDescription(profile.fullBioUk, profile.fullBioEn, i18n.language);

  return (
    <SheetDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('profile:preview.title')}</DialogTitle>
      <DialogContent>
        <Avatar src={profile.photoUrl} alt="" />
        <HeroName>
          {profile.firstName} {profile.lastName}
        </HeroName>
        <HeroMeta>{t(`search:specialties.${profile.specialty}`)}</HeroMeta>
        <HeroMeta>
          {cityName} · {clinicName}
        </HeroMeta>
        <FieldValue>{bio}</FieldValue>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('profile:preview.close')}</Button>
      </DialogActions>
    </SheetDialog>
  );
};
