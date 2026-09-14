import { styled } from '@mui/material';

export const CalendarBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(2, 3),
}));

export const MonthsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  width: '100%',
  flexShrink: 0,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

export const MonthCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 0,
  padding: theme.spacing(1, 1, 1.25),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const MonthHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 32,
  flexShrink: 0,
});

export const MonthTitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  textTransform: 'capitalize',
}));

export const WeekdayRow = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

export const WeekdayCell = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 28,
  flexShrink: 0,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const DayGrid = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
});

export const DayRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const DayCell = styled('button')<{
  $selected?: boolean;
  $hasFree?: boolean;
  $muted?: boolean;
  $outlined?: boolean;
}>(({ theme, $selected, $hasFree, $muted, $outlined }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  width: 36,
  height: 36,
  flexShrink: 0,
  padding: 0,
  border: $outlined ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
  borderRadius: 8,
  backgroundColor: $selected ? theme.palette.primary.main : 'transparent',
  color: $selected
    ? theme.palette.primary.contrastText
    : $muted
      ? theme.palette.text.disabled
      : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: $selected || $hasFree ? 600 : 400,
  cursor: $muted ? 'default' : 'pointer',

  '&:disabled': {
    cursor: 'default',
  },

  '&:hover:not(:disabled)': {
    backgroundColor: $selected ? theme.palette.primary.main : theme.palette.action.hover,
  },
}));

export const DayDot = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: 999,
  backgroundColor: $active ? theme.palette.primary.main : 'transparent',
}));

export const LegendRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  flexShrink: 0,
}));

export const LegendItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const LegendSwatch = styled('span')<{ $size: 'lg' | 'sm'; $tone: 'accent' | 'muted' }>(
  ({ theme, $size, $tone }) => ({
    width: $size === 'lg' ? 14 : 7,
    height: $size === 'lg' ? 14 : 7,
    flexShrink: 0,
    borderRadius: 999,
    backgroundColor:
      $tone === 'accent' ? theme.palette.primary.main : theme.palette.action.disabledBackground,
  }),
);

export const LegendLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const SlotsBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
  flexShrink: 0,
  paddingTop: theme.spacing(0.5),
}));

export const SlotsHeading = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
});

export const SlotsTitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '24px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const SlotsSubtitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

/** Fixed band so empty / loading / slots don't resize the dialog. */
export const SlotsContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  width: '100%',
  minHeight: 112,
});

export const SlotsGrid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  width: '100%',
  alignContent: 'flex-start',
}));

export const SlotChip = styled('button')<{ $selected?: boolean }>(({ theme, $selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 76,
  height: 40,
  flexShrink: 0,
  padding: theme.spacing(0, 2),
  borderRadius: 10,
  border: `1px solid ${$selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: $selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: 600,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: $selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

export const SlotSkeleton = styled('div')(({ theme }) => ({
  minWidth: 76,
  height: 40,
  flexShrink: 0,
  borderRadius: 10,
  backgroundColor: theme.palette.action.hover,
}));

export const FormatBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
  flexShrink: 0,
  marginTop: 'auto',
  paddingTop: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const FormatToggleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  alignSelf: 'flex-start',
}));

export const FormatSideLabel = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  ...theme.typography.body2,
  fontWeight: $active ? 600 : 500,
  color: $active ? theme.palette.text.primary : theme.palette.text.secondary,
}));

export const EmptyState = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  minHeight: 96,
}));

export const EmptyMascot = styled('img')({
  width: 72,
  height: 72,
  flexShrink: 0,
  objectFit: 'contain',
});

export const EmptyCopy = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  maxWidth: 420,
}));

export const LoadingState = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  minHeight: 96,
}));
