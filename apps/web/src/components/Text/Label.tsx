import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: 500,
}));

export const Label = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="span" color={color} {...props} />;
};
