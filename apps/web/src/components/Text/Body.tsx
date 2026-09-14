import { styled, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
}));

export const Body = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="p" color={color} {...props} />;
};
