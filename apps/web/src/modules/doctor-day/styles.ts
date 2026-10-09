import { Button } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { styled } from '@/theme/styled';

export const Page = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  backgroundColor: theme.palette.background.default,
}));

export const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: 1344,
  marginInline: 'auto',
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2.5),
    paddingBlock: theme.spacing(3),
    paddingInline: 48,
  },
}));

export const GreetingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
}));

export const GreetingCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  flex: 1,
  minWidth: 0,
}));

export const GreetingTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 700,
  color: theme.palette.text.primary,

  [theme.breakpoints.up('sm')]: {
    fontSize: 28,
    lineHeight: '36px',
  },

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const GreetingSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.up('sm')]: {
    fontSize: 16,
    lineHeight: '22px',
  },
}));

export const DateLine = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'capitalize',
  flexShrink: 0,

  [theme.breakpoints.up('sm')]: {
    lineHeight: '20px',
  },
}));

export const NextVisitCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 2),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  cursor: 'pointer',

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.75, 3),
  },
}));

export const NextVisitHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const OverlineLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.primary.main,
}));

export const NextVisitBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2.5),
  },
}));

export const TimeBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flexShrink: 0,
  minWidth: 88,
  width: '100%',

  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const TimeValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  lineHeight: '34px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const TimeMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const VisitMain = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  flex: 1,
  minWidth: 0,
}));

export const DoctorLine = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const OutlineButton = styled(Button)(({ theme }) => ({
  height: 40,
  minHeight: 40,
  boxSizing: 'border-box',
  paddingInline: theme.spacing(2),
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
  transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.16),
    borderColor: theme.palette.primary.main,
  },
}));

export const DangerOutlineButton = styled(OutlineButton)(({ theme }) => ({
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,

  '&:hover': {
    backgroundColor: alpha(theme.palette.error.main, theme.palette.mode === 'light' ? 0.08 : 0.16),
    borderColor: theme.palette.error.main,
  },
}));

export const HeroActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
  flexBasis: '100%',

  // Complete is wrapped in Tooltip target span — size both children equally.
  '& > .MuiButton-root, & > span': {
    flex: '1 1 calc(50% - 8px)',
    minWidth: 120,
  },

  '& .MuiButton-root': {
    height: 40,
    minHeight: 40,
    boxSizing: 'border-box',
    borderRadius: 8,
    fontWeight: 600,
    textTransform: 'none',
    paddingTop: 0,
    paddingBottom: 0,
  },

  '& > span > .MuiButton-root': {
    width: '100%',
  },

  [theme.breakpoints.up('md')]: {
    flexBasis: 'auto',
    width: 'auto',
    flexShrink: 0,
    flexWrap: 'nowrap',

    '& > .MuiButton-root, & > span': {
      flex: '0 0 auto',
      minWidth: 0,
    },

    '& .MuiButton-root': {
      whiteSpace: 'nowrap',
    },
  },
}));

export const LayoutRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}));

export const MainColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: 1,
  minWidth: 0,
  order: 1,

  [theme.breakpoints.up('lg')]: {
    maxWidth: 980,
  },
}));

export const SideColumn = styled('aside')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  flexShrink: 0,
  order: 2,

  [theme.breakpoints.up('lg')]: {
    width: 340,
  },
}));

export const TabRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
  width: '100%',

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

export const FilterTab = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
  padding: theme.spacing(1, 1.25),
  borderRadius: 12,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.06 : 0.12)
    : theme.palette.background.paper,
  cursor: 'pointer',
  textAlign: 'left',
  boxShadow:
    theme.palette.mode === 'light' ? '0 1px 3px rgba(22, 62, 82, 0.04)' : 'none',
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'box-shadow', 'transform'],
    { duration: theme.transitions.duration.shorter },
  ),

  '&:hover': {
    backgroundColor: $active
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.1 : 0.18)
      : theme.palette.action.hover,
    borderColor: $active
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.45),
    boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.08 : 0.28)}`,
    transform: 'translateY(-1px)',
  },

  [theme.breakpoints.up('sm')]: {
    gap: 10,
    padding: theme.spacing(1.25, 1.5),
  },
}));

export const TabIcon = styled('span')<{ $tone: 'green' | 'orange' | 'red' }>(({ theme, $tone }) => {
  const map = {
    green: {
      bg: theme.palette.mode === 'light' ? '#E8F5F0' : 'rgba(46, 177, 145, 0.18)',
      color: theme.palette.primary.dark,
    },
    orange: {
      bg: theme.palette.mode === 'light' ? '#FFF0E8' : 'rgba(200, 120, 72, 0.18)',
      color: '#C87848',
    },
    red: {
      bg: theme.palette.mode === 'light' ? '#FDEEEE' : 'rgba(196, 92, 92, 0.18)',
      color: theme.palette.error.main,
    },
  };
  const palette = map[$tone];

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: palette.bg,
    color: palette.color,
  };
});

export const TabCount = styled('span')<{ $tone?: 'green' | 'orange' | 'red' }>(
  ({ theme, $tone = 'green' }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    lineHeight: '24px',
    fontWeight: 700,
    color:
      $tone === 'orange'
        ? '#C87848'
        : $tone === 'red'
          ? theme.palette.error.main
          : theme.palette.primary.dark,

    [theme.breakpoints.up('sm')]: {
      fontSize: 22,
      lineHeight: '26px',
    },
  }),
);

export const TabCopy = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const TabLabel = styled('span')(({ theme }) => ({
  display: 'block',
  fontFamily: theme.typography.fontFamily,
  fontSize: 10,
  lineHeight: '13px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));


export const SectionHead = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1.5),

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
}));

export const SectionTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
}));

export const SectionMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const VisitRow = styled('div')<{
  $variant?: 'default' | 'cancelled' | 'reserved' | 'pending';
}>(({ theme, $variant = 'default' }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 14,
  marginBottom: theme.spacing(1),
  borderRadius: 12,
  boxSizing: 'border-box',
  backgroundColor:
    $variant === 'pending' || $variant === 'reserved'
      ? theme.palette.slotReservedBg
      : theme.palette.background.paper,
  border:
    $variant === 'pending' || $variant === 'reserved'
      ? `1px dashed ${theme.palette.divider}`
      : '1px solid transparent',
  boxShadow:
    $variant === 'pending' || $variant === 'reserved'
      ? 'none'
      : theme.palette.mode === 'light'
        ? '0 1px 2px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)'
        : 'none',
  cursor: 'pointer',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 2.25),
    minHeight: 96,
  },
}));

export const RowTime = styled('span')<{ $muted?: boolean }>(({ theme, $muted }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  width: 56,
  minWidth: 56,
  flexShrink: 0,
  color: $muted ? theme.palette.text.secondary : theme.palette.text.primary,
}));

export const VisitIdentity = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  minWidth: 0,
}));

export const RowMain = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 0,
});

export const RowTitleLine = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const PatientName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StatusPill = styled('span')<{
  $tone?: 'accent' | 'warning' | 'muted' | 'error' | 'reserved';
}>(({ theme, $tone = 'accent' }) => {
  const map = {
    accent: {
      bg: 'rgba(46, 177, 145, 0.12)',
      color: theme.palette.primary.main,
      border: 'none',
    },
    warning: {
      bg: 'rgba(196, 92, 92, 0.12)',
      color: theme.palette.error.main,
      border: 'none',
    },
    muted: {
      bg: theme.palette.action.selected,
      color: theme.palette.text.secondary,
      border: 'none',
    },
    error: {
      bg: 'rgba(196, 92, 92, 0.12)',
      color: theme.palette.error.main,
      border: 'none',
    },
    reserved: {
      bg: 'transparent',
      color: theme.palette.text.secondary,
      border: `1px dashed ${theme.palette.text.secondary}`,
    },
  };
  const palette = map[$tone];

  return {
    display: 'inline-flex',
    padding: '2px 8px',
    borderRadius: 999,
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 600,
    backgroundColor: palette.bg,
    color: palette.color,
    border: palette.border,
  };
});

export const FormatChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: 999,
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.default,
}));

export const RowMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const RowActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  flexShrink: 0,
  width: '100%',

  '& .MuiButton-root': {
    width: '100%',
  },

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 'auto',
    maxWidth: 'none',
    gap: theme.spacing(1),

    '& .MuiButton-root': {
      width: 'auto',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
  },
}));

export const SmallButton = styled(Button)({
  minHeight: 36,
  paddingInline: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 13,
  lineHeight: '18px',
  borderRadius: 8,
});

/** Wrapper so MUI Tooltip works on a disabled Complete button. */
export const CompleteTooltipTarget = styled('span')({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'stretch',
  alignSelf: 'stretch',
});

export const WidgetCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2.25, 2.75),
  },
}));

export const WidgetHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const WidgetTitle = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const WidgetMeta = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const WidgetLink = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  fontWeight: 600,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['color', 'opacity'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },
}));

export const WeekDays = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.75),
  justifyContent: 'space-between',
}));

export const WeekDay = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  flex: 1,
  minWidth: 0,
  padding: theme.spacing(1, 0.25, 1.25),
  borderRadius: 12,
  border: $active ? `1.5px solid ${theme.palette.primary.main}` : '1.5px solid transparent',
  cursor: 'pointer',
  backgroundColor: $active
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.14)
    : theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'box-shadow', 'transform'],
    { duration: theme.transitions.duration.shorter },
  ),

  '&:hover': {
    backgroundColor: $active
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.14 : 0.22)
      : theme.palette.action.hover,
    borderColor: $active
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.45 : 0.55),
    boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.08 : 0.28)}`,
    transform: 'translateY(-1px)',
  },

  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'none',
  },
}));

export const WeekDayLabel = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: $active ? 600 : 500,
  color: $active ? theme.palette.primary.main : theme.palette.text.secondary,
}));

export const WeekDayNumber = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: $active ? 700 : 600,
  color: theme.palette.text.primary,
}));

export const WeekDots = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  height: 6,
  flexShrink: 0,
});

export const WeekDot = styled('span')<{ $tone: 'visit' | 'pending' | 'cancelled' | 'free' }>(
  ({ theme, $tone }) => {
    const colors = {
      visit: theme.palette.primary.main,
      pending: theme.palette.pink.main,
      cancelled: theme.palette.error.main,
      free: theme.palette.text.disabled,
    };

    return {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: colors[$tone],
      flexShrink: 0,
    };
  },
);

export const WeekLegend = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  alignItems: 'center',
  fontSize: 11,
  color: theme.palette.text.secondary,
}));

export const WeekLegendItem = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const FreeHint = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const FreeList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  cursor: 'default',
  userSelect: 'none',
}));

export const FreeRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 1.5),
  boxSizing: 'border-box',
  borderBottom: `1px solid ${theme.palette.divider}`,

  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const FreeRowTime = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const FreeRowDot = styled('span')(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: alpha(theme.palette.text.secondary, 0.55),
}));

export const FreeRowMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

export const FreeEmptyNote = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 12,
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const FreeShowMore = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: theme.spacing(0.25, 0),
  cursor: 'pointer',
  alignSelf: 'flex-start',
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const QuickLink = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.25, 1.5),
  border: `1px solid transparent`,
  borderRadius: 12,
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'left',
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'box-shadow', 'transform'],
    { duration: theme.transitions.duration.shorter },
  ),

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: alpha(theme.palette.primary.main, 0.35),
    boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.08 : 0.28)}`,
    transform: 'translateY(-1px)',
  },
}));

export const EmptyBlock = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  border: `1px dashed ${theme.palette.divider}`,
  textAlign: 'center',
}));

export const VisitsEmptyState = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  minHeight: 280,
  padding: theme.spacing(5, 3),
  borderRadius: 16,
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}));

export const VisitsEmptyTitle = styled('div')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const VisitsEmptyBody = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: 360,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const ShowMore = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  width: '100%',
  minHeight: 44,
  marginTop: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'box-shadow', 'transform'],
    { duration: theme.transitions.duration.shorter },
  ),

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.14),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.08 : 0.28)}`,
    transform: 'translateY(-1px)',
  },
}));

export const SlotChip = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  padding: theme.spacing(1, 1.75),
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  fontWeight: 600,
  transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    backgroundColor: $active
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.16),
    borderColor: theme.palette.primary.main,
    color: $active ? theme.palette.primary.contrastText : theme.palette.primary.main,
  },
}));

export const ModalPaper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  boxSizing: 'border-box',
  overflowY: 'auto',
  maxHeight: '100%',

  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2.25),
  },
}));

export const ModalHeaderRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const ModalTitleBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

export const ModalTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ModalSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const ModalCloseButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  flexShrink: 0,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  backgroundColor: theme.palette.action.selected,
  color: theme.palette.text.secondary,
  padding: 0,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const ModalOverline = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.primary.main,
}));

export const FieldBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));

export const FieldLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const MonthLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  textTransform: 'capitalize',
}));

export const DayChips = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
}));

export const DayChip = styled('button')<{ $active?: boolean; $disabled?: boolean }>(
  ({ theme, $active, $disabled }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    border: 'none',
    cursor: $disabled ? 'default' : 'pointer',
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    lineHeight: '16px',
    fontWeight: $active ? 700 : 400,
    backgroundColor: $active ? theme.palette.primary.main : 'transparent',
    color: $active
      ? theme.palette.primary.contrastText
      : $disabled
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
    opacity: $disabled && !$active ? 0.7 : 1,
  }),
);

export const FormatSideLabel = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: $active ? 600 : 500,
  color: $active ? theme.palette.primary.main : theme.palette.text.secondary,
  flexShrink: 0,
}));

export const ModalActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing(1.5),
  width: '100%',
  paddingTop: theme.spacing(0.5),

  '& > *': {
    flex: 1,
    width: '100%',
  },

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',

    '& > *': {
      width: 'auto',
    },
  },
}));

export const SoftStatusPill = styled('span')<{
  $tone?: 'accent' | 'warning' | 'error' | 'muted';
}>(({ theme, $tone = 'accent' }) => {
  const map = {
    accent: {
      bg: theme.palette.mode === 'light' ? '#E8F5F0' : 'rgba(46, 177, 145, 0.18)',
      color: theme.palette.primary.main,
    },
    warning: {
      bg: theme.palette.mode === 'light' ? '#FFF0E0' : 'rgba(230, 162, 60, 0.18)',
      color: theme.palette.mode === 'light' ? '#B87830' : '#E6A23C',
    },
    error: {
      bg: theme.palette.mode === 'light' ? '#FDEEEE' : 'rgba(196, 92, 92, 0.18)',
      color: theme.palette.error.main,
    },
    muted: {
      bg: theme.palette.action.selected,
      color: theme.palette.text.secondary,
    },
  };
  const palette = map[$tone];

  return {
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: 999,
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    lineHeight: '16px',
    fontWeight: 600,
    backgroundColor: palette.bg,
    color: palette.color,
    flexShrink: 0,
  };
});

export const DayInfoSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const DayInfoSectionTitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const DayInfoWindowRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  boxSizing: 'border-box',
}));

export const DayInfoWindowTime = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const DayInfoWindowMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

export const DayInfoNote = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const ScheduleSlotRow = styled('button')<{
  $variant?: 'booked' | 'pending' | 'cancelled' | 'free';
}>(({ theme, $variant = 'booked' }) => {
  const variants = {
    booked: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      opacity: 1,
    },
    pending: {
      backgroundColor: theme.palette.mode === 'light' ? '#FFF8F0' : 'rgba(230, 162, 60, 0.12)',
      border: `1px solid ${theme.palette.mode === 'light' ? '#F0DCC8' : 'rgba(230, 162, 60, 0.35)'}`,
      opacity: 1,
    },
    cancelled: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      opacity: 0.75,
    },
    free: {
      backgroundColor: theme.palette.background.paper,
      border: `1px dashed ${theme.palette.primary.main}`,
      opacity: 1,
    },
  };

  return {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: theme.spacing(1.5, 1.75),
    borderRadius: 12,
    cursor: $variant === 'free' ? 'default' : 'pointer',
    textAlign: 'left',
    font: 'inherit',
    boxSizing: 'border-box',
    ...variants[$variant],

    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
      gap: 14,
    },
  };
});

export const ScheduleSlotTime = styled('span')<{
  $tone?: 'default' | 'accent' | 'muted' | 'strike';
}>(({ theme, $tone = 'default' }) => ({
  width: 56,
  flexShrink: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 700,
  color:
    $tone === 'accent'
      ? theme.palette.primary.main
      : $tone === 'muted' || $tone === 'strike'
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
  textDecoration: $tone === 'strike' ? 'line-through' : 'none',
}));

export const ScheduleSlotMain = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
});

export const ScheduleSlotName = styled('span')<{ $muted?: boolean }>(({ theme, $muted }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
  color: $muted ? theme.palette.text.secondary : theme.palette.text.primary,
}));

export const ScheduleSlotMeta = styled('span')<{ $tone?: 'default' | 'warning' | 'error' | 'accent' }>(
  ({ theme, $tone = 'default' }) => {
    const colors = {
      default: theme.palette.text.secondary,
      warning: theme.palette.mode === 'light' ? '#B87830' : '#E6A23C',
      error: theme.palette.error.main,
      accent: theme.palette.primary.main,
    };

    return {
      fontFamily: theme.typography.fontFamily,
      fontSize: 13,
      lineHeight: '18px',
      color: colors[$tone],
    };
  },
);

export const ScheduleChevron = styled('span')(({ theme }) => ({
  flexShrink: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  color: theme.palette.primary.main,
}));

export const VisitCardShell = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  boxSizing: 'border-box',
}));

export const VisitCardHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(2.5),
  paddingInline: theme.spacing(2),

  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(3),
    paddingInline: theme.spacing(3.5),
  },
}));

export const VisitCardBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  width: '100%',
  boxSizing: 'border-box',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(2.5),
    padding: theme.spacing(2.5, 3.5),
  },
}));

export const VisitCardTimeCol = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 'auto',
  flexShrink: 0,

  [theme.breakpoints.up('sm')]: {
    width: 100,
  },
}));

export const VisitCardTime = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  lineHeight: '34px',
  fontWeight: 700,
  color: theme.palette.text.primary,

  [theme.breakpoints.up('sm')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const VisitCardDuration = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const VisitCardMain = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flex: 1,
  minWidth: 0,
}));

export const VisitCardNameRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const VisitCardName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,

  [theme.breakpoints.up('sm')]: {
    fontSize: 24,
    lineHeight: '32px',
  },
}));

export const VisitCardChips = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const MetaChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  padding: '4px 10px',
  borderRadius: 999,
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  backgroundColor: theme.palette.action.selected,
  color: theme.palette.text.secondary,
}));

export const VisitCardReason = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  color: theme.palette.text.primary,
}));

export const VisitCardContact = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const VisitCardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  width: '100%',
  paddingInline: theme.spacing(2),
  paddingBottom: theme.spacing(2.5),
  boxSizing: 'border-box',

  '& > .MuiButton-root': {
    flex: '1 1 auto',
    width: '100%',
    minHeight: 48,
    height: 48,
    borderRadius: 12,
    boxSizing: 'border-box',
    textTransform: 'none',
    fontWeight: 600,
  },

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingInline: theme.spacing(3.5),
    paddingBottom: theme.spacing(3),

    '& > .MuiButton-root': {
      width: 'auto',
      flex: '1 1 0',
    },
  },
}));
