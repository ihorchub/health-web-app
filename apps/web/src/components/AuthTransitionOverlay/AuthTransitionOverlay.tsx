import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAuthTransition } from '@/hooks/useAuthTransition';
import { styled } from '@/theme/styled';

const Overlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal + 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.72)' : 'rgba(10, 22, 30, 0.72)',
  backdropFilter: 'blur(2px)',
}));

const Label = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

/** Covers chrome/role swaps during login & logout so the UI does not flash. */
export const AuthTransitionOverlay = () => {
  const { t } = useTranslation('common');
  const { isTransitioning } = useAuthTransition();

  if (!isTransitioning) {
    return null;
  }

  return (
    <Overlay role="status" aria-live="polite" aria-busy="true">
      <CircularProgress size={36} />
      <Label>{t('authTransition.loading')}</Label>
    </Overlay>
  );
};
