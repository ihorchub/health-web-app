import { styled, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.h1,
}));

export const TitleH1 = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="h1" color={color} {...props} />;
};
