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
}));

interface LegalPlaceholderPageProps {
  titleKey: 'footer.privacy' | 'footer.terms';
}

export const LegalPlaceholderPage = ({ titleKey }: LegalPlaceholderPageProps) => {
  const { t } = useTranslation('common');

  return (
    <Page>
      <PageTitle>{t(titleKey)}</PageTitle>
      <Body color="textSecondary">{t('legalPlaceholder')}</Body>
    </Page>
  );
};
