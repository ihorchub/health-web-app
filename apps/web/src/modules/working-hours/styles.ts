import { Button, MenuItem, TextField, styled } from '@mui/material';

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

export const BackLink = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const PageIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const TitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  lineHeight: '36px',
  fontWeight: 700,

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const PageSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  color: theme.palette.text.secondary,
}));

export const HelpLink = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const MonthRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
}));

export const MonthSelect = styled(TextField)({
  minWidth: 220,
});

export const HintBanner = styled('div')(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(230, 162, 60, 0.12)' : theme.palette.action.hover,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const Card = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const CardTitle = styled('h2')({
  margin: 0,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
});

export const LegendRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  fontSize: 13,
  color: theme.palette.text.secondary,
}));

export const ZoneStripRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const ZoneStrip = styled('div')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  flex: 1,
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  backgroundColor:
    $tone === 'a'
      ? theme.palette.mode === 'light'
        ? '#FED9DF'
        : theme.palette.slotReservedBg
      : theme.palette.mode === 'light'
        ? 'rgba(46, 177, 145, 0.15)'
        : 'rgba(62, 196, 163, 0.2)',
}));

export const MonthsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}));

export const MonthBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const MonthLabel = styled('span')({
  fontWeight: 700,
  fontSize: 14,
  textTransform: 'capitalize',
});

export const DayGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 4,
});

export const Weekday = styled('span')(({ theme }) => ({
  textAlign: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const DayCell = styled('button')<{
  $zone?: 'a' | 'b' | 'none';
  $today?: boolean;
  $weekend?: boolean;
  $marked?: boolean;
}>(({ theme, $zone, $today, $weekend, $marked }) => ({
  position: 'relative',
  aspectRatio: '1',
  border: $today ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
  borderRadius: 8,
  cursor: 'default',
  fontSize: 12,
  fontWeight: $today ? 700 : 500,
  backgroundColor:
    $zone === 'a'
      ? theme.palette.mode === 'light'
        ? '#FED9DF'
        : theme.palette.slotReservedBg
      : $zone === 'b'
        ? theme.palette.mode === 'light'
          ? 'rgba(46, 177, 145, 0.18)'
          : 'rgba(62, 196, 163, 0.25)'
        : $weekend
          ? theme.palette.action.hover
          : 'transparent',
  color: theme.palette.text.primary,

  '&::after': $marked
    ? {
        content: '""',
        position: 'absolute',
        bottom: 3,
        width: 4,
        height: 4,
        borderRadius: 999,
        backgroundColor: theme.palette.text.primary,
      }
    : {},
}));

export const ZonesRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const ZonePanel = styled(Card)(({ theme }) => ({
  gap: theme.spacing(2),
  minHeight: 0,

  [theme.breakpoints.up('lg')]: {
    minHeight: 400,
  },
}));

export const ZoneHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ZoneBadge = styled('span')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  backgroundColor: $tone === 'a' ? '#FED9DF' : theme.palette.primary.main,
  color: $tone === 'a' ? theme.palette.text.primary : '#FFFFFF',
}));

export const Callout = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: theme.palette.action.hover,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const ParamList = styled('dl')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  margin: 0,
}));

export const ParamRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  fontSize: 14,
});

export const ParamDt = styled('dt')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

export const ParamDd = styled('dd')(({ theme }) => ({
  margin: 0,
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'right',
}));

export const RadioGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const RadioRow = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: 14,
  cursor: 'pointer',
}));

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

export const SegmentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const SegmentButton = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  fontWeight: 600,
  cursor: 'pointer',
}));

export const PrimarySaveButton = styled(Button)({
  alignSelf: 'stretch',
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 700,
});

export const DangerOutlineButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 700,
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
}));

export const ImportantStrip = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
  borderRadius: 20,
  backgroundColor:
    theme.palette.mode === 'light' ? '#FED9DF' : theme.palette.slotReservedBg,
}));

export const Mascot = styled('img')({
  width: 56,
  height: 56,
  flexShrink: 0,
});

export const SwitchRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export { MenuItem };
