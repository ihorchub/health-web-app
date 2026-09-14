import { styled, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.h3,
}));

export const TitleH3 = ({ color = 'textPrimary', ...props }: TypographyProps) => {
  return <Root component="h3" color={color} {...props} />;
};
