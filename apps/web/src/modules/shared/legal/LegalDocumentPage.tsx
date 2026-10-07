import { styled } from '@/theme/styled';

import { useTranslation } from 'react-i18next';

import { useGetLegalPrivacy, useGetLegalTerms } from '@/api/generated/legal/legal';
import { Body, PageTitle, TitleH2 } from '@/components/Text';
import { AppLanguage } from '@/i18n';

import { parseLegalBody } from './parseLegalBody';

const Page = styled('article')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 720,
  marginInline: 'auto',
  padding: theme.spacing(4, 3, 6),

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2, 5),
    gap: theme.spacing(2.5),
  },
}));

const Blocks = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const SectionHeading = styled(TitleH2)(({ theme }) => ({
  marginTop: theme.spacing(2),

  '&:first-of-type': {
    marginTop: 0,
  },
}));

const StatusMessage = styled(Body)({
  textAlign: 'center',
});

interface LegalDocumentPageProps {
  document: 'privacy' | 'terms';
}

export const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => {
  const { i18n, t } = useTranslation('common');
  const lang = i18n.language === AppLanguage.EN ? AppLanguage.EN : AppLanguage.UK;

  const privacyQuery = useGetLegalPrivacy(
    { lang },
    { query: { enabled: document === 'privacy' } },
  );
  const termsQuery = useGetLegalTerms(
    { lang },
    { query: { enabled: document === 'terms' } },
  );

  const query = document === 'privacy' ? privacyQuery : termsQuery;
  const { data, isLoading, isError } = query;

  if (isLoading) {
    return (
      <Page>
        <StatusMessage color="textSecondary">{t('legal.loading')}</StatusMessage>
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page>
        <StatusMessage color="textSecondary">{t('legal.error')}</StatusMessage>
      </Page>
    );
  }

  const blocks = parseLegalBody(data.body);

  return (
    <Page>
      <PageTitle>{data.title}</PageTitle>
      <Blocks>
        {blocks.map((block, index) =>
          block.type === 'heading' ? (
            <SectionHeading key={index}>{block.text}</SectionHeading>
          ) : (
            <Body key={index}>{block.text}</Body>
          ),
        )}
      </Blocks>
    </Page>
  );
};
