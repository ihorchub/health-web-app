import { Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const BannerRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${theme.palette.warning.main}`,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'rgba(230, 162, 60, 0.12)'
      : theme.palette.action.hover,
}));

const BannerTitle = styled('strong')(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.text.primary,
}));

const BannerBody = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

interface PendingDecisionBannerProps {
  count: number;
  onOpen: () => void;
}

export const PendingDecisionBanner = ({ count, onOpen }: PendingDecisionBannerProps) => {
  const { t } = useTranslation('cabinet');

  return (
    <BannerRoot>
      <BannerTitle>{t('pendingBanner.title', { count })}</BannerTitle>
      <BannerBody>{t('pendingBanner.body')}</BannerBody>
      <Button variant="contained" color="primary" onClick={onOpen}>
        {t('pendingBanner.cta')}
      </Button>
    </BannerRoot>
  );
};
