import { createTheme } from '@mui/material/styles';

import type { ThemeMode } from '@/context/themeStorage';
import { mediclyColors, mediclyRadii, mediclyTypography } from '@/theme/tokens';

declare module '@mui/material/styles' {
  interface Palette {
    brand: Palette['primary'];
    pink: Palette['primary'];
    muted: string;
    onBrand: string;
    border: string;
    slotReservedBg: string;
  }

  interface PaletteOptions {
    brand?: PaletteOptions['primary'];
    pink?: PaletteOptions['primary'];
    muted?: string;
    onBrand?: string;
    border?: string;
    slotReservedBg?: string;
  }
}

export const createMediclyTheme = (mode: ThemeMode) => {
  const colors = mediclyColors[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.accent,
        dark: colors.accentActive,
        light: colors.accentHover,
        contrastText: colors.onAccent,
      },
      secondary: {
        main: colors.pink,
        contrastText: colors.text,
      },
      error: {
        main: colors.error,
      },
      success: {
        main: colors.success,
      },
      background: {
        default: colors.page,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
        disabled: colors.disabledText,
      },
      divider: colors.border,
      action: {
        disabled: colors.disabledText,
        disabledBackground: colors.disabled,
      },
      brand: {
        main: colors.brand,
        contrastText: colors.onBrand,
      },
      pink: {
        main: colors.pink,
        contrastText: colors.text,
      },
      muted: colors.muted,
      onBrand: colors.onBrand,
      border: colors.border,
      slotReservedBg: colors.slotReservedBg,
    },
    typography: {
      fontFamily: mediclyTypography.fontFamily,
      h1: {
        ...mediclyTypography.h1,
      },
      h2: {
        ...mediclyTypography.h2,
      },
      h3: {
        ...mediclyTypography.h3,
      },
      body1: {
        ...mediclyTypography.body,
      },
      body2: {
        ...mediclyTypography.meta,
      },
      button: {
        fontSize: 16,
        lineHeight: '24px',
        fontWeight: 500,
        textTransform: 'none',
      },
      overline: {
        ...mediclyTypography.overline,
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: mediclyRadii.md,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.page,
            color: colors.text,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: mediclyRadii.buttonLg,
            minHeight: 48,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
            variants: [
              {
                props: { variant: 'contained', color: 'primary' },
                style: {
                  backgroundColor: theme.palette.primary.main,
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    color: '#FFFFFF',
                  },
                  '&:active': {
                    backgroundColor: theme.palette.primary.dark,
                    color: '#FFFFFF',
                  },
                  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                    color: '#FFFFFF',
                  },
                },
              },
            ],
          }),
        },
      },
    },
  });
};
