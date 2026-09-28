import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
}));

export const Body = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="p" color={color} {...props} />;
};
