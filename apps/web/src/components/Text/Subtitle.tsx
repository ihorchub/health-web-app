import { styled, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 500,
}));

export const Subtitle = ({ color = 'textSecondary', ...props }: TypographyProps) => {
  return <Root component="p" color={color} {...props} />;
};
