import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.h2,
}));

export const TitleH2 = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="h2" color={color} {...props} />;
};
