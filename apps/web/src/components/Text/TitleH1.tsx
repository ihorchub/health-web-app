import { Typography } from '@mui/material';
import { styled } from '@/theme/styled';

import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
}));

export const TitleH1 = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="h1" color={color} {...props} />;
};
