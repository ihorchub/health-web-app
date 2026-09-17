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
  gap: theme.spacing(1.5),
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

export const DateLine = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: 'capitalize',
}));

export const LayoutRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
}));

export const MainColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
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

export const SectionHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
  marginBottom: theme.spacing(1.5),
}));

export const SectionTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const SectionMeta = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const SectionLink = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const CardSurface = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 20,
  boxShadow:
    theme.palette.mode === 'light'
      ? '2px 3px 6px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
  boxSizing: 'border-box',
}));

export const NextVisitCard = styled(CardSurface)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.25),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  minHeight: 170,

  [theme.breakpoints.up('md')]: {
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
  color: theme.palette.text.secondary,
}));

export const StatusPill = styled('span')<{ $tone?: 'accent' | 'warning' | 'muted' }>(
  ({ theme, $tone = 'accent' }) => {
    const tones = {
      accent: {
        bg: theme.palette.primary.main,
        color: '#FFFFFF',
      },
      warning: {
        bg: theme.palette.mode === 'light' ? '#F5EBE9' : theme.palette.action.selected,
        color: theme.palette.text.primary,
      },
      muted: {
        bg: theme.palette.action.hover,
        color: theme.palette.text.secondary,
      },
    };
    const palette = tones[$tone];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 999,
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 600,
      backgroundColor: palette.bg,
      color: palette.color,
    };
  },
);

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

export const MetaLine = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const FormatChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.primary,
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

  '&:hover': {
    borderColor: theme.palette.error.main,
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(196, 92, 92, 0.08)' : undefined,
  },
}));

export const VisitRow = styled(CardSurface)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.25),
  borderRadius: 12,
  marginBottom: theme.spacing(1),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

export const RowDateLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  flexShrink: 0,
  minWidth: 56,
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

export const RowDoctorName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const RowMetaText = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const ShowMoreLink = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginTop: theme.spacing(0.5),
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const CarouselTrack = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  overflowX: 'auto',
  paddingBottom: theme.spacing(0.5),
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',

  '& > article': {
    flex: '0 0 min(318px, 85vw)',
    scrollSnapAlign: 'start',
  },
}));

export const WidgetCard = styled(CardSurface)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.25, 2.75),
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

export const WidgetBody = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const WidgetMeta = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const WidgetAction = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minHeight: 40,
  marginTop: theme.spacing(0.5),
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
}));

export const CalendarShell = styled(WidgetCard)(({ theme }) => ({
  gap: theme.spacing(1.25),
}));

export const CalendarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const CalendarMonth = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  textTransform: 'capitalize',
}));

export const CalendarGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 4,
});

export const WeekdayCell = styled('span')(({ theme }) => ({
  textAlign: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: 11,
  lineHeight: '16px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  paddingBlock: 4,
}));

export const DayCell = styled('button')<{
  $muted?: boolean;
  $today?: boolean;
  $marked?: boolean;
  $selected?: boolean;
}>(({ theme, $muted, $today, $marked, $selected }) => {
  const highlighted = $today || $selected;

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: '1',
    border: 'none',
    borderRadius: 999,
    cursor: $muted ? 'default' : 'pointer',
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    lineHeight: '18px',
    fontWeight: highlighted ? 700 : 500,
    color: $muted
      ? theme.palette.text.disabled
      : highlighted
        ? '#FFFFFF'
        : theme.palette.text.primary,
    backgroundColor: highlighted ? theme.palette.primary.main : 'transparent',

    '&::after': $marked
      ? {
          content: '""',
          position: 'absolute',
          bottom: 4,
          width: 4,
          height: 4,
          borderRadius: 999,
          backgroundColor: highlighted ? '#FFFFFF' : theme.palette.primary.main,
        }
      : {},
  };
});

export const CalendarLegend = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const LegendItem = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,

  '&::before': {
    content: '""',
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const PromoDoctorRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start',
}));

export const PromoAvatar = styled('img')({
  width: 56,
  height: 56,
  borderRadius: 999,
  objectFit: 'cover',
  flexShrink: 0,
});

export const ReviewBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const SpecialtyGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

export const SpecialtyTile = styled('button')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  minHeight: 118,
  padding: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  textAlign: 'left',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(22, 62, 82, 0.06)'
      : 'none',
}));

export const SpecialtyTileLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const SpecialtyTileIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.primary.main,
}));

export const EmptyBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  borderRadius: 16,
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const EmptyTitle = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const EmptyBody = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const LoadingSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const StateBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  minHeight: 280,
  padding: theme.spacing(4, 3),
  textAlign: 'center',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const StateMascot = styled('img')({
  width: 120,
  height: 120,
  objectFit: 'contain',
  flexShrink: 0,
});

export const StateTitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StateBody = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '22px',
  maxWidth: 420,
  color: theme.palette.text.secondary,
}));

export const DayModalTitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
}));

export const DayModalActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
  padding: theme.spacing(2, 3, 3),
  boxSizing: 'border-box',
}));

export const CalendarDaySectionTitle = styled('p')(({ theme }) => ({
  margin: theme.spacing(2, 0, 0.5),
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const CalendarDayList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

export const CalendarDayRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const CalendarDayRowTime = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const CalendarDayRowMeta = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));
