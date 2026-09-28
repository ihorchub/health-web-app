import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
}));

export const TitleH3 = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="h3" color={color} {...props} />;
};
