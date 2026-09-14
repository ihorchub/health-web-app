import { Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Body, Overline, PageTitle, Subtitle } from '@/components/Text';
import { usePreviewRole } from '@/hooks/usePreviewRole';
import { useThemeMode } from '@/hooks/useThemeMode';
import { AppRole } from '@/types/role';

const LIKA_POSE = '/brand/lika-poses/lika1.png';

const Page = styled('section')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));

const Mascot = styled('img')({
  width: 120,
  height: 'auto',
});

const RoleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const RoleButton = styled(Button)<{ $active: boolean }>(({ theme, $active }) => ({
  minHeight: 40,
  borderColor: $active ? theme.palette.primary.main : theme.palette.divider,
  backgroundColor: $active ? theme.palette.primary.main : 'transparent',
  color: $active ? '#FFFFFF' : theme.palette.text.primary,

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: $active ? theme.palette.primary.light : theme.palette.action.hover,
    color: $active ? '#FFFFFF' : theme.palette.text.primary,
  },
}));

export const DevCheckPage = () => {
  const { t } = useTranslation('common');
  const { mode } = useThemeMode();
  const { role, setRole } = usePreviewRole();

  return (
    <Page>
      <Mascot src={LIKA_POSE} alt="" />
      <PageTitle>{t('stubTitle')}</PageTitle>
      <Subtitle>{t('stubSubtitle')}</Subtitle>
      <Body color="textSecondary">
        {t('previewRole')}: {role} · {mode}
      </Body>
      <RoleRow>
        <RoleButton
          variant="outlined"
          $active={role === AppRole.GUEST}
          onClick={() => {
            setRole(AppRole.GUEST);
          }}
        >
          {t('roleGuest')}
        </RoleButton>
        <RoleButton
          variant="outlined"
          $active={role === AppRole.PATIENT}
          onClick={() => {
            setRole(AppRole.PATIENT);
          }}
        >
          {t('rolePatient')}
        </RoleButton>
        <RoleButton
          variant="outlined"
          $active={role === AppRole.DOCTOR}
          onClick={() => {
            setRole(AppRole.DOCTOR);
          }}
        >
          {t('roleDoctor')}
        </RoleButton>
      </RoleRow>
      <Overline color="primary">{t('themeOk')}</Overline>
    </Page>
  );
};
