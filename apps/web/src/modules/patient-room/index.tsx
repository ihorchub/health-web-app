import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Body, PageTitle } from '@/components/Text';

const Page = styled('section')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));

export const PatientCabinetStubPage = () => {
  const { t } = useTranslation('auth');

  return (
    <Page>
      <PageTitle>{t('cabinet.patientTitle')}</PageTitle>
      <Body color="textSecondary">{t('cabinet.patientBody')}</Body>
    </Page>
  );
};
