import { Button, styled } from '@mui/material';

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
  gap: theme.spacing(2.5),
  width: '100%',
  maxWidth: 1344,
  marginInline: 'auto',
  paddingBlock: theme.spacing(3),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    paddingInline: 48,
  },
}));

export const GreetingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  fontSize: 28,
  lineHeight: '36px',
  fontWeight: 700,
  color: theme.palette.text.primary,

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const GreetingSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  color: theme.palette.text.secondary,
}));

export const DateLine = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'capitalize',
  flexShrink: 0,
}));

export const MetricsRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1.5),
  width: '100%',

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

export const MetricCard = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(22, 62, 82, 0.06)'
      : 'none',
}));

export const MetricIcon = styled('span')<{ $tone: 'green' | 'orange' | 'teal' | 'red' }>(
  ({ theme, $tone }) => {
    const colors = {
      green: theme.palette.primary.main,
      orange: '#E6A23C',
      teal: theme.palette.primary.light,
      red: theme.palette.error.main,
    };

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.palette.action.hover,
      color: colors[$tone],
      flexShrink: 0,
    };
  },
);

export const MetricValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 24,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const MetricLabel = styled('span')(({ theme }) => ({
  display: 'block',
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const NextVisitCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.75, 3),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '2px 3px 6px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  cursor: 'pointer',
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
  color: theme.palette.text.secondary,
}));

export const NextVisitBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const TimeBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flexShrink: 0,
  minWidth: 88,
});

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
  fontSize: 18,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const OutlineButton = styled(Button)(({ theme }) => ({
  minHeight: 40,
  paddingInline: theme.spacing(2),
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
}));

export const DangerOutlineButton = styled(OutlineButton)(({ theme }) => ({
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
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
  gap: theme.spacing(1),
  width: '100%',

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

export const FilterTab = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.background.paper : theme.palette.action.hover,
  cursor: 'pointer',
  textAlign: 'left',
  boxShadow: $active && theme.palette.mode === 'light' ? '0 4px 12px rgba(22,62,82,0.08)' : 'none',
}));

export const TabCount = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '24px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const TabLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const SectionHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
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
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.25),
  marginBottom: theme.spacing(1),
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border:
    $variant === 'reserved'
      ? `1px dashed ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(22, 62, 82, 0.04)'
      : 'none',

  ...($variant === 'cancelled'
    ? {
        backgroundColor:
          theme.palette.mode === 'light' ? 'rgba(196, 92, 92, 0.06)' : theme.palette.action.hover,
      }
    : {}),

  ...($variant === 'reserved'
    ? {
        backgroundColor: theme.palette.slotReservedBg,
      }
    : {}),

  ...($variant === 'pending'
    ? {
        backgroundColor:
          theme.palette.mode === 'light' ? 'rgba(230, 162, 60, 0.08)' : theme.palette.action.hover,
      }
    : {}),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

export const RowTime = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  minWidth: 56,
  flexShrink: 0,
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
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
}));

export const StatusPill = styled('span')<{ $tone?: 'accent' | 'warning' | 'muted' | 'error' }>(
  ({ theme, $tone = 'accent' }) => {
    const map = {
      accent: { bg: theme.palette.primary.main, color: '#FFFFFF' },
      warning: { bg: '#E6A23C', color: '#FFFFFF' },
      muted: { bg: theme.palette.action.selected, color: theme.palette.text.secondary },
      error: { bg: theme.palette.error.main, color: '#FFFFFF' },
    };
    const palette = map[$tone];

    return {
      display: 'inline-flex',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 600,
      backgroundColor: palette.bg,
      color: palette.color,
    };
  },
);

export const FormatChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  backgroundColor: theme.palette.action.hover,
}));

export const RowMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const RowActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  flexShrink: 0,
  width: '100%',

  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },

  '& .MuiButton-root': {
    [theme.breakpoints.down('sm')]: {
      flex: '1 1 auto',
      minWidth: 0,
    },
  },
}));

export const SmallButton = styled(Button)({
  minHeight: 36,
  textTransform: 'none',
  fontWeight: 600,
});

export const WaitingLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: '#E6A23C',
  flexShrink: 0,
}));

export const WidgetCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.25, 2.75),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
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
  gap: 4,
  flex: 1,
  padding: theme.spacing(0.75, 0.5),
  borderRadius: 12,
  border: 'none',
  cursor: 'pointer',
  backgroundColor: $active ? theme.palette.primary.main : 'transparent',
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
}));

export const WeekLegend = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  fontSize: 11,
  color: theme.palette.text.secondary,
}));

export const FreeRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 10,
  backgroundColor: theme.palette.action.hover,
  fontSize: 14,
  fontWeight: 600,
}));

export const PendingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: 13,
}));

export const QuickLink = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(1.25, 0),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'left',
}));

export const EmptyBlock = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  border: `1px dashed ${theme.palette.divider}`,
  textAlign: 'center',
}));

export const ShowMore = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const SlotPicker = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const SlotChip = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  cursor: 'pointer',
  fontWeight: 600,
}));
