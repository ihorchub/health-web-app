import { Dialog, styled } from '@mui/material';

/** Full-screen on small viewports; themed surface for cabinet / doctor modals. */
export const SheetDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(22, 62, 82, 0.45)'
        : 'rgba(11, 28, 36, 0.72)',
  },

  '& .MuiDialog-paper': {
    margin: theme.spacing(2),
    width: '100%',
    borderRadius: 16,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0 8px 24px rgba(22, 62, 82, 0.12)'
        : 'none',
    border:
      theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',

    [theme.breakpoints.down('sm')]: {
      margin: 0,
      maxWidth: '100%',
      width: '100%',
      height: '100dvh',
      maxHeight: '100dvh',
      borderRadius: 0,
    },
  },
}));
