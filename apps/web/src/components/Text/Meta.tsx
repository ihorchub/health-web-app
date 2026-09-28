import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
}));

export const Meta = ({ color = 'textSecondary', ...props }: TypographyProps) => {
  return <Root component="span" color={color} {...props} />;
};
