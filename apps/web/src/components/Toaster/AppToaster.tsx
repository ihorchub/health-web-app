import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { GlobalStyles, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { useThemeMode } from '@/hooks/useThemeMode';

const toastIcon = (node: ReactNode) => (
  <span className="medicly-toast__icon">{node}</span>
);

export const AppToaster = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();

  return (
    <>
      <GlobalStyles
        styles={{
          '[data-sonner-toaster]': {
            fontFamily: theme.typography.fontFamily,
            '--normal-bg': theme.palette.background.paper,
            '--normal-border': theme.palette.divider,
            '--normal-text': theme.palette.text.primary,
            '--success-bg':
              theme.palette.mode === 'light' ? '#E8F5F0' : 'rgba(46, 177, 145, 0.18)',
            '--success-border': theme.palette.primary.main,
            '--success-text': theme.palette.text.primary,
            '--error-bg':
              theme.palette.mode === 'light' ? '#FDEEEE' : 'rgba(196, 92, 92, 0.18)',
            '--error-border': theme.palette.error.main,
            '--error-text': theme.palette.text.primary,
            '--info-bg':
              theme.palette.mode === 'light' ? '#EEF3F6' : 'rgba(22, 62, 82, 0.35)',
            '--info-border': theme.palette.divider,
            '--info-text': theme.palette.text.primary,
            '--warning-bg':
              theme.palette.mode === 'light' ? '#FFF0E8' : 'rgba(200, 120, 72, 0.18)',
            '--warning-border': '#C87848',
            '--warning-text': theme.palette.text.primary,
          },
          '[data-sonner-toast].medicly-toast': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1.25),
            width: 'min(420px, calc(100vw - 32px))',
            padding: theme.spacing(1.5, 1.75),
            borderRadius: 14,
            border: '1px solid',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 12px 40px rgba(22, 62, 82, 0.14)'
                : '0 12px 40px rgba(0, 0, 0, 0.45)',
            fontSize: 15,
            lineHeight: '22px',
            fontWeight: 600,
          },
          '[data-sonner-toast].medicly-toast [data-content]': {
            flex: 1,
            minWidth: 0,
          },
          '[data-sonner-toast].medicly-toast [data-title]': {
            fontWeight: 600,
            color: 'inherit',
          },
          '[data-sonner-toast].medicly-toast [data-description]': {
            fontWeight: 500,
            color: theme.palette.text.secondary,
            marginTop: 2,
          },
          '.medicly-toast__icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.72)'
                : 'rgba(255, 255, 255, 0.08)',
          },
          '[data-sonner-toast][data-type="success"] .medicly-toast__icon': {
            color: theme.palette.primary.dark,
            backgroundColor:
              theme.palette.mode === 'light' ? '#D7F0E8' : 'rgba(46, 177, 145, 0.28)',
          },
          '[data-sonner-toast][data-type="error"] .medicly-toast__icon': {
            color: theme.palette.error.main,
            backgroundColor:
              theme.palette.mode === 'light' ? '#F8DADA' : 'rgba(196, 92, 92, 0.28)',
          },
          '[data-sonner-toast][data-type="warning"] .medicly-toast__icon': {
            color: '#C87848',
            backgroundColor:
              theme.palette.mode === 'light' ? '#FFE4D4' : 'rgba(200, 120, 72, 0.28)',
          },
          '[data-sonner-toast][data-type="info"] .medicly-toast__icon, [data-sonner-toast]:not([data-type]) .medicly-toast__icon':
            {
              color: theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === 'light' ? '#E4ECF0' : 'rgba(255, 255, 255, 0.1)',
            },
        }}
      />
      <Toaster
        theme={mode}
        position="bottom-center"
        richColors
        closeButton
        expand
        gap={10}
        offset={24}
        duration={4000}
        icons={{
          success: toastIcon(<IconCircleCheck size={20} stroke={2} />),
          error: toastIcon(<IconAlertCircle size={20} stroke={2} />),
          warning: toastIcon(<IconAlertTriangle size={20} stroke={2} />),
          info: toastIcon(<IconInfoCircle size={20} stroke={2} />),
        }}
        toastOptions={{
          className: 'medicly-toast',
        }}
      />
    </>
  );
};
