import { Button, MenuItem, TextField, styled } from '@mui/material';

const zoneAFill = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(232, 197, 192, 0.27)' : 'rgba(74, 56, 54, 0.55)';

const zoneBFill = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(46, 177, 145, 0.13)' : 'rgba(62, 196, 163, 0.2)';

const mintSoft = (mode: 'light' | 'dark') =>
  mode === 'light' ? '#E6F7F2' : 'rgba(62, 196, 163, 0.16)';

const pinkSoft = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(232, 197, 192, 0.32)' : 'rgba(201, 163, 158, 0.22)';

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
  gap: 6,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const PageIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const TitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(3),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const TitleBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  minWidth: 0,
  flex: 1,
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  lineHeight: '36px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: theme.palette.text.primary,

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const PageSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: 640,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  color: theme.palette.text.secondary,
}));

export const HelpLink = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  border: 'none',
  background: 'none',
  padding: theme.spacing(1, 0, 0),
  cursor: 'pointer',
  flexShrink: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const HelpMascot = styled('img')({
  width: 40,
  height: 40,
  flexShrink: 0,
  objectFit: 'contain',
});

export const MonthRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'stretch',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
}));

export const MonthSelect = styled(TextField)({
  minWidth: 220,
});

export const HintBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  flex: 1,
  minHeight: 44,
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  backgroundColor: theme.palette.slotReservedBg,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.primary,
  boxSizing: 'border-box',
}));

export const Card = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
  boxSizing: 'border-box',
}));

export const CardHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const CardTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.palette.text.primary,
}));

export const LegendRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
  paddingTop: 4,
}));

export const LegendItem = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const LegendToday = styled('span')(({ theme }) => ({
  width: 18,
  height: 18,
  borderRadius: 999,
  border: `2px solid ${theme.palette.primary.main}`,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

export const LegendDot = styled('span')(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: 999,
  backgroundColor: theme.palette.text.primary,
  flexShrink: 0,
}));

export const LegendWeekend = styled('span')(({ theme }) => ({
  width: 18,
  height: 18,
  borderRadius: 999,
  backgroundColor: theme.palette.action.disabledBackground,
  flexShrink: 0,
}));

export const ZoneStripStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ZoneStrip = styled('div')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  backgroundColor:
    $tone === 'a' ? theme.palette.slotReservedBg : mintSoft(theme.palette.mode),
}));

export const ZoneStripCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
}));

export const ZoneStripTitle = styled('strong')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 700,
  color: $tone === 'a' ? theme.palette.text.primary : theme.palette.primary.main,
}));

export const ZoneStripMeta = styled('span')(({ theme }) => ({
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const MonthsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 1.5, 2),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 0,
  },
}));

export const MonthBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  paddingTop: 4,

  [theme.breakpoints.up('lg')]: {
    paddingInline: 12,

    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const MonthLabel = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 36,
  fontWeight: 600,
  fontSize: 15,
  lineHeight: '22px',
  textTransform: 'lowercase',
  color: theme.palette.text.primary,
}));

export const DayGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 2,
  justifyItems: 'center',
});

export const Weekday = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 28,
  textAlign: 'center',
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const DayCell = styled('button')<{
  $zone?: 'a' | 'b' | 'none';
  $today?: boolean;
  $weekend?: boolean;
  $marked?: boolean;
  $past?: boolean;
  $selected?: boolean;
  $inRange?: boolean;
  $selectable?: boolean;
}>(({ theme, $zone, $today, $weekend, $marked, $past, $selected, $inRange, $selectable }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  width: 36,
  height: 36,
  border: $selected || $today
    ? `1.5px solid ${theme.palette.primary.main}`
    : '1px solid transparent',
  borderRadius: 8,
  cursor: $selectable ? 'pointer' : 'default',
  padding: 0,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: $selected || $today ? 600 : 500,
  backgroundColor: $selected
    ? theme.palette.primary.main
    : $inRange
      ? theme.palette.mode === 'light'
        ? 'rgba(46, 177, 145, 0.28)'
        : 'rgba(62, 196, 163, 0.35)'
      : $zone === 'a'
        ? zoneAFill(theme.palette.mode)
        : $zone === 'b'
          ? zoneBFill(theme.palette.mode)
          : $weekend
            ? theme.palette.action.hover
            : 'transparent',
  color: $selected
    ? '#FFFFFF'
    : $past
      ? theme.palette.text.disabled
      : $today
        ? theme.palette.primary.main
        : theme.palette.text.primary,

  '&:disabled': {
    cursor: 'default',
    opacity: 1,
  },

  '&:hover:not(:disabled)': $selectable
    ? {
        outline: `1.5px solid ${theme.palette.primary.main}`,
        outlineOffset: 0,
      }
    : undefined,

  '&::after': $marked && !$selected
    ? {
        content: '""',
        width: 5,
        height: 5,
        borderRadius: 999,
        backgroundColor: theme.palette.text.primary,
      }
    : {},
}));

export const ZonesRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  alignItems: 'stretch',

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  },
}));

export const ZonePanel = styled(Card)(({ theme }) => ({
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  minHeight: 0,
  height: '100%',

  [theme.breakpoints.up('lg')]: {
    minHeight: 872,
  },
}));

export const ZoneHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
}));

export const ZoneTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ZoneBadge = styled('span')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  backgroundColor: $tone === 'a' ? pinkSoft(theme.palette.mode) : mintSoft(theme.palette.mode),
  color: $tone === 'a' ? theme.palette.text.primary : theme.palette.primary.main,
}));

export const Callout = styled('div')<{ $tone?: 'a' | 'b' | 'mint' | 'warn' }>(
  ({ theme, $tone = 'a' }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: theme.spacing(1.5, 1.75),
    borderRadius: 12,
    backgroundColor:
      $tone === 'b' || $tone === 'mint'
        ? mintSoft(theme.palette.mode)
        : $tone === 'warn'
          ? pinkSoft(theme.palette.mode)
          : theme.palette.slotReservedBg,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.primary,
  }),
);

export const SectionLabel = styled('strong')(({ theme }) => ({
  display: 'block',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ParamList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}));

export const ParamRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.primary,
}));

export const BulkSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const RadioGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}));

export const RadioRow = styled('label')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: $active ? 500 : 400,
  color: theme.palette.text.primary,
  cursor: 'pointer',
}));

export const RadioDot = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: 999,
  flexShrink: 0,
  boxSizing: 'border-box',
  border: $active
    ? `2px solid ${theme.palette.primary.main}`
    : `1.5px solid ${theme.palette.divider}`,

  '&::after': $active
    ? {
        content: '""',
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: theme.palette.primary.main,
      }
    : {},
}));

export const ReasonBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}));

export const ReasonHint = styled('span')(({ theme }) => ({
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const VacationBlock = styled('div')<{ $disabled?: boolean }>(({ theme, $disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  color: $disabled ? theme.palette.text.disabled : theme.palette.text.primary,
}));

export const VacationHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
});

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2.5),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

export const FieldFull = styled('div')({
  gridColumn: '1 / -1',
});

export const SegmentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const SegmentButton = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  cursor: 'pointer',
}));

export const DurationCustomRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const DurationCustomLabel = styled('span')(({ theme }) => ({
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

export const DurationCustomHint = styled('span')(({ theme }) => ({
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const DurationCustomField = styled(TextField)({
  width: 120,
});

export const SwitchRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  minHeight: 48,
  paddingInline: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxSizing: 'border-box',
}));

export const PrimarySaveButton = styled(Button)({
  alignSelf: 'stretch',
  minHeight: 48,
  marginTop: 'auto',
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 12,
});

export const DangerOutlineButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,

  '&:hover': {
    borderWidth: 1.5,
    borderColor: theme.palette.error.main,
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(196, 92, 92, 0.06)' : 'rgba(224, 122, 122, 0.1)',
  },
}));

export const SoftButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
  boxShadow: 'none',
  backgroundColor: theme.palette.action.disabledBackground,
  color: theme.palette.text.disabled,

  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
  },

  '&:not(.Mui-disabled)': {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',

    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: 'none',
    },
  },
}));

export const ImportantStrip = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
  borderRadius: 16,
  backgroundColor: theme.palette.slotReservedBg,
}));

export const ImportantCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  minWidth: 0,
  color: theme.palette.text.primary,

  '& strong': {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 700,
  },

  '& ul': {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  '& li': {
    fontSize: 14,
    lineHeight: '20px',

    '&::before': {
      content: '"• "',
    },
  },
}));

export const Mascot = styled('img')({
  width: 56,
  height: 56,
  flexShrink: 0,
  objectFit: 'contain',
});

export const ModalPaper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  width: '100%',
  boxSizing: 'border-box',
}));

export const ModalHeaderRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const ModalTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: 22,
  lineHeight: '28px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: theme.palette.text.primary,
}));

export const ModalCloseButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: 999,
  background: 'none',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

export const ModalBody = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 15,
  lineHeight: '22px',
  color: theme.palette.text.secondary,
}));

export const SummaryBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: theme.spacing(1.75, 2),
  borderRadius: 12,
  backgroundColor: mintSoft(theme.palette.mode),
  border: `1px solid ${
    theme.palette.mode === 'light' ? 'rgba(46, 177, 145, 0.22)' : 'rgba(62, 196, 163, 0.35)'
  }`,
}));

export const SummaryLine = styled('div')<{ $muted?: boolean }>(({ theme, $muted }) => ({
  fontSize: $muted ? 13 : 14,
  lineHeight: $muted ? '18px' : '20px',
  fontWeight: $muted ? 400 : 600,
  color: $muted ? theme.palette.text.secondary : theme.palette.text.primary,
}));

export const WarnCallout = styled(Callout)(({ theme }) => ({
  border: `1px solid ${theme.palette.pink.main}`,
  backgroundColor: pinkSoft(theme.palette.mode),
}));

export const InfoIconBubble = styled('span')<{ $tone?: 'pink' | 'mint' }>(({ theme, $tone }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: 999,
  flexShrink: 0,
  backgroundColor:
    $tone === 'mint'
      ? theme.palette.mode === 'light'
        ? 'rgba(46, 177, 145, 0.2)'
        : 'rgba(62, 196, 163, 0.28)'
      : theme.palette.mode === 'light'
        ? '#FED9DF'
        : 'rgba(201, 163, 158, 0.35)',
}));

export const ModalActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  paddingTop: 4,
}));

export const OutlineModalButton = styled(Button)(({ theme }) => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
}));

export const DangerModalButton = styled(Button)(({ theme }) => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,

  '&:hover': {
    borderWidth: 1.5,
    borderColor: theme.palette.error.main,
  },
}));

export const PrimaryModalButton = styled(Button)({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
});

export const GhostModalButton = styled(Button)(({ theme }) => ({
  minHeight: 44,
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 999,
  color: theme.palette.text.primary,
}));

export const DayChips = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
}));

export const DaysBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const DayChip = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: theme.spacing(0, 2.25),
  borderRadius: 8,
  border: $active ? 'none' : `1px solid ${theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: $active ? 600 : 500,
  cursor: 'pointer',
}));

export const OverlineLabel = styled('span')(({ theme }) => ({
  display: 'block',
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const FromPill = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: 999,
  backgroundColor: mintSoft(theme.palette.mode),
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const DateRangeField = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  minHeight: 48,
  paddingInline: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  boxSizing: 'border-box',
}));

export const SummaryList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

export const SummaryListRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: theme.spacing(1.75, 2),

  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const SummaryListLabel = styled('span')(({ theme }) => ({
  width: 88,
  flexShrink: 0,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const SummaryListValue = styled('span')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const MintDot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  marginTop: 6,
  borderRadius: 999,
  flexShrink: 0,
  backgroundColor: theme.palette.primary.main,
}));

export { MenuItem, pinkSoft, mintSoft };
