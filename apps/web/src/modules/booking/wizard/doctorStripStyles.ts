import { styled } from '@mui/material';

export const DoctorStrip = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.75),
  flexShrink: 0,
  width: '100%',
  padding: theme.spacing(1.25, 3),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StripPhoto = styled('img')({
  width: 48,
  height: 48,
  flexShrink: 0,
  objectFit: 'cover',
  borderRadius: 999,
});

export const StripText = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  minWidth: 0,
  flexGrow: 1,
}));

export const StripName = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StripMeta = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));
