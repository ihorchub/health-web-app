import { Button, MenuItem, TextField } from '@mui/material';
import { styled } from '@/theme/styled';

const mintSoft = (mode: 'light' | 'dark') =>
  mode === 'light' ? '#E6F7F2' : 'rgba(62, 196, 163, 0.16)';

const pinkSoft = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(232, 197, 192, 0.45)' : 'rgba(201, 163, 158, 0.22)';

/** Zone A accent label — readable in both themes. */
const zoneAAccent = (mode: 'light' | 'dark') =>
  mode === 'light' ? '#9A6B66' : '#E8C4BE';

/** Zone A card border — muted rose family. */
const zoneABorder = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(201, 163, 158, 0.55)' : 'rgba(201, 163, 158, 0.4)';

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
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: 1344,
  marginInline: 'auto',
  paddingBlock: theme.spacing(3),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    paddingInline: 48,
    paddingBlock: theme.spacing(4),
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
  gap: theme.spacing(2.5),
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

export const MonthSelect = styled(TextField)(({ theme }) => ({
  minWidth: 220,
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const HintBanner = styled('p')(({ theme }) => ({
  margin: 0,
  flex: 1,
  fontSize: 13,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const Card = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
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
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.palette.text.primary,
}));

export const LegendRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
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

/** Zone A day fill — same warm pink family as Zone A banner. */
const dayZoneABg = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(232, 197, 192, 0.35)' : 'rgba(74, 56, 54, 0.5)';

/** Zone B day fill — same mint family as Zone B banner. */
const dayZoneBBg = (mode: 'light' | 'dark') => mintSoft(mode);

/** Matches DayCell regular day-off fill. */
const dayOffBg = (mode: 'light' | 'dark') =>
  mode === 'light' ? 'rgba(22, 62, 82, 0.04)' : 'rgba(255, 255, 255, 0.045)';

export const LegendWorking = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  backgroundColor: dayZoneBBg(theme.palette.mode),
  boxSizing: 'border-box',
  flexShrink: 0,
}));

export const LegendToday = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  border: `1.5px solid ${theme.palette.primary.main}`,
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  flexShrink: 0,
}));

export const LegendDot = styled('span')(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: 999,
  backgroundColor: theme.palette.text.secondary,
  flexShrink: 0,
}));

/** Exception — dashed accent border + bottom dot (same as DayCell). */
export const LegendVacation = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  backgroundColor: dayZoneBBg(theme.palette.mode),
  boxSizing: 'border-box',
  flexShrink: 0,
  position: 'relative',
  border: `1.5px dashed ${theme.palette.primary.main}`,

  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: 1,
    width: 3,
    height: 3,
    marginLeft: -1.5,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));

/** Regular weekly day off — muted fill (same as DayCell). */
export const LegendRegularOff = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  backgroundColor: dayOffBg(theme.palette.mode),
  flexShrink: 0,
}));

export const LegendWeekend = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  backgroundColor: dayOffBg(theme.palette.mode),
  flexShrink: 0,
}));

/** Corner accent dot — saved plan (same as DayCell ::before when planned). */
export const LegendPlanned = styled('span')(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: 6,
  boxSizing: 'border-box',
  flexShrink: 0,
  position: 'relative',
  backgroundColor: dayZoneBBg(theme.palette.mode),

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 2,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const ZoneStripStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));

/** Full-width informational banners — not chips / tabs / clickable. */
export const ZoneStrip = styled('div')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  minHeight: 52,
  padding: theme.spacing(1.25, 2),
  borderRadius: 12,
  boxSizing: 'border-box',
  pointerEvents: 'none',
  backgroundColor:
    $tone === 'b'
      ? mintSoft(theme.palette.mode)
      : theme.palette.mode === 'light'
        ? 'rgba(232, 197, 192, 0.28)'
        : 'rgba(74, 56, 54, 0.42)',
}));

export const ZoneStripDot = styled('span')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  width: 8,
  height: 8,
  borderRadius: 999,
  flexShrink: 0,
  backgroundColor:
    $tone === 'b' ? theme.palette.primary.main : theme.palette.text.secondary,
}));

export const ZoneStripCopy = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
  flex: 1,
});

export const ZoneStripTitle = styled('strong')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 700,
  letterSpacing: '0.02em',
  color: $tone === 'a' ? theme.palette.text.primary : theme.palette.primary.main,
}));

export const ZoneStripMeta = styled('span')<{ $tone?: 'a' | 'b' }>(({ theme, $tone = 'a' }) => ({
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: $tone === 'b' ? theme.palette.primary.dark : theme.palette.text.secondary,
}));

export const MonthsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 0,
  },
}));

export const MonthBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,

  [theme.breakpoints.up('lg')]: {
    paddingInline: theme.spacing(2),

    '&:first-of-type': {
      paddingLeft: 0,
    },

    '&:last-of-type': {
      paddingRight: 0,
    },

    '&:not(:last-of-type)': {
      borderRight: `1px solid ${
        theme.palette.mode === 'light'
          ? 'rgba(22, 62, 82, 0.08)'
          : 'rgba(255, 255, 255, 0.08)'
      }`,
    },
  },
}));

export const MonthLabel = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 28,
  fontWeight: 700,
  fontSize: 15,
  lineHeight: '22px',
  letterSpacing: '-0.01em',
  textTransform: 'lowercase',
  color: theme.palette.text.primary,
}));

export const DayGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 4,
  justifyItems: 'center',
});

export const Weekday = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 24,
  textAlign: 'center',
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: 500,
  color: theme.palette.text.disabled,
}));

export const DayCell = styled('button')<{
  $zone?: 'a' | 'b' | 'none';
  $today?: boolean;
  $weekend?: boolean;
  $marked?: boolean;
  $vacation?: boolean;
  /** Regular weekly day off (from working-days rule), not a one-off exception. */
  $regularOff?: boolean;
  $planned?: boolean;
  $past?: boolean;
  $selected?: boolean;
  $inRange?: boolean;
  $selectable?: boolean;
}>(({
  theme,
  $zone,
  $today,
  $marked,
  $vacation,
  $regularOff,
  $planned,
  $past,
  $selected,
  $inRange,
  $selectable,
}) => {
  const mode = theme.palette.mode;
  const isSelected = Boolean($selected || $inRange);
  const isZoneA = $zone === 'a';
  const isZoneB = $zone === 'b';

  // 1) Background = base day status (never stacked fills)
  // Zone fills match banner colors; regular offs stay muted.
  let backgroundColor: string = 'transparent';
  if (isSelected) {
    backgroundColor = theme.palette.primary.main;
  } else if ($regularOff && !isZoneA) {
    backgroundColor = dayOffBg(mode);
  } else if (isZoneA && $selectable) {
    backgroundColor = dayZoneABg(mode);
  } else if (isZoneB && $selectable) {
    backgroundColor = dayZoneBBg(mode);
  }

  // 2) Border = special state (exception > today > none)
  let border: string = '1px solid transparent';
  if (isSelected) {
    border = `1.5px solid ${theme.palette.primary.main}`;
  } else if ($vacation) {
    border = `1.5px dashed ${theme.palette.primary.main}`;
  } else if ($today) {
    border = `1.5px solid ${theme.palette.primary.main}`;
  }

  // 3) Text
  let color: string = theme.palette.text.primary;
  if (isSelected) {
    color = '#FFFFFF';
  } else if ($past || $regularOff) {
    color = theme.palette.text.disabled;
  } else if ($today) {
    color = theme.palette.primary.main;
  }

  // Corner dots: appointments (neutral) win over planned (accent)
  const showCornerDot = !isSelected && ($marked || ($planned && !$vacation));
  const cornerDotColor = $marked
    ? theme.palette.text.secondary
    : theme.palette.primary.main;

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    border,
    borderRadius: 8,
    cursor: $selectable ? 'pointer' : 'default',
    padding: 0,
    margin: 0,
    fontSize: 13,
    lineHeight: 1,
    fontWeight: isSelected || $today ? 600 : 500,
    fontVariantNumeric: 'tabular-nums',
    backgroundColor,
    color,
    boxSizing: 'border-box',

    '&:disabled': {
      cursor: 'default',
      opacity: 1,
    },

    '&:hover:not(:disabled)': $selectable
      ? {
          backgroundColor: isSelected
            ? theme.palette.primary.main
            : isZoneA
              ? mode === 'light'
                ? 'rgba(232, 197, 192, 0.5)'
                : 'rgba(74, 56, 54, 0.65)'
              : mode === 'light'
                ? '#D4F0E8'
                : 'rgba(62, 196, 163, 0.24)',
        }
      : undefined,

    // Appointments / saved plan — top-right indicator only
    '&::before': showCornerDot
      ? {
          content: '""',
          position: 'absolute',
          top: 4,
          right: 4,
          width: 4,
          height: 4,
          borderRadius: 999,
          backgroundColor: cornerDotColor,
        }
      : undefined,

    // Exception accent marker — bottom center (with dashed border)
    '&::after': $vacation && !isSelected
      ? {
          content: '""',
          position: 'absolute',
          bottom: 3,
          left: '50%',
          width: 3,
          height: 3,
          marginLeft: -1.5,
          borderRadius: 999,
          backgroundColor: theme.palette.primary.main,
        }
      : undefined,
  };
});

export const ZonesRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  alignItems: 'stretch',

  [theme.breakpoints.up('lg')]: {
    // ~44% / ~56%
    gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1fr)',
  },
}));

export const ZonePanel = styled(Card)<{ $tone?: 'a' | 'b' }>(({ theme, $tone = 'a' }) => ({
  minHeight: 0,
  height: '100%',
  width: '100%',
  ...($tone === 'b'
    ? {
        gap: theme.spacing(2),
        padding: theme.spacing(2.5),
        backgroundColor:
          theme.palette.mode === 'light'
            ? 'rgba(230, 247, 242, 0.65)'
            : mintSoft(theme.palette.mode),
        borderColor:
          theme.palette.mode === 'light'
            ? 'rgba(46, 177, 145, 0.35)'
            : 'rgba(62, 196, 163, 0.4)',
        boxShadow:
          theme.palette.mode === 'light'
            ? '0 8px 28px rgba(22, 62, 82, 0.06)'
            : 'none',
      }
    : {
        gap: theme.spacing(2),
        padding: theme.spacing(2.5),
        backgroundColor:
          theme.palette.mode === 'light' ? '#FBF4F3' : theme.palette.slotReservedBg,
        borderColor: zoneABorder(theme.palette.mode),
        boxShadow: 'none',
      }),
}));

export const ZoneHead = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.75),
}));

export const ZoneHeadRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
});

export const ZoneTitle = styled('h3')<{ $tone?: 'a' | 'b' }>(({ theme, $tone = 'a' }) => ({
  margin: 0,
  fontSize: $tone === 'b' ? 20 : 18,
  lineHeight: $tone === 'b' ? '28px' : '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ZoneIntro = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const ZoneBadge = styled('span')<{ $tone: 'a' | 'b' }>(({ theme, $tone }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 8px',
  borderRadius: 6,
  fontSize: 11,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  backgroundColor: $tone === 'a' ? pinkSoft(theme.palette.mode) : mintSoft(theme.palette.mode),
  color: $tone === 'a' ? zoneAAccent(theme.palette.mode) : theme.palette.primary.main,
  border:
    $tone === 'a'
      ? `1px solid ${zoneABorder(theme.palette.mode)}`
      : `1px solid transparent`,
}));

/** Active status — green indicator (as in mock), not zone-colored. */
export const StatusPill = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '3px 8px',
  borderRadius: 999,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(46, 177, 145, 0.1)' : 'rgba(62, 196, 163, 0.16)',

  '&::before': {
    content: '""',
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.palette.success.main,
  },
}));

/** Date / period control — white surface on tinted zone cards. */
export const PeriodField = styled('button')<{ $compact?: boolean }>(({ theme, $compact }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: $compact ? 'flex-start' : 'space-between',
  gap: theme.spacing($compact ? 1 : 1.5),
  width: $compact ? 'auto' : '100%',
  minWidth: $compact ? 0 : undefined,
  flex: $compact ? '1 1 auto' : undefined,
  minHeight: $compact ? 32 : 38,
  padding: $compact ? theme.spacing(0.5, 1) : theme.spacing(0.75, 1.25),
  borderRadius: $compact ? 6 : 10,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'light' && $compact
      ? theme.palette.background.default
      : theme.palette.background.paper,
  boxSizing: 'border-box',
  fontFamily: theme.typography.fontFamily,
  fontSize: $compact ? 12 : 14,
  lineHeight: $compact ? '16px' : '20px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  textAlign: 'left',
  cursor: 'pointer',

  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const PeriodFieldButton = PeriodField;

export const ZoneTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    minHeight: 38,
  },

  '& .MuiOutlinedInput-input': {
    paddingTop: 8,
    paddingBottom: 8,
  },

  '& .MuiInputLabel-root': {
    fontSize: 13,
  },
}));

export const PickerPanel = styled('div')(({ theme }) => ({
  width: 280,
  padding: theme.spacing(1.5),
  boxSizing: 'border-box',
}));

export const PickerHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontSize: 14,
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PickerNavButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 8,
  background: 'none',
  color: theme.palette.text.secondary,
  cursor: 'pointer',

  '&:disabled': {
    opacity: 0.35,
    cursor: 'default',
  },

  '&:hover:not(:disabled)': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const PickerGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 2,
  justifyItems: 'center',
});

export const PickerWeekday = styled('span')(({ theme }) => ({
  width: 32,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 500,
  color: theme.palette.text.disabled,
}));

export const PickerDay = styled('button')<{ $selected?: boolean }>(({ theme, $selected }) => ({
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 8,
  padding: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  fontWeight: $selected ? 700 : 500,
  cursor: 'pointer',
  backgroundColor: $selected ? theme.palette.primary.main : 'transparent',
  color: $selected ? '#FFFFFF' : theme.palette.text.primary,

  '&:disabled': {
    color: theme.palette.text.disabled,
    cursor: 'default',
    opacity: 0.45,
  },

  '&:hover:not(:disabled)': {
    backgroundColor: $selected ? theme.palette.primary.main : theme.palette.action.hover,
  },
}));

export const PeriodFieldsRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(1),
  alignItems: 'center',

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr auto 1fr',
  },
}));

export const PeriodDash = styled('span')(({ theme }) => ({
  display: 'none',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontWeight: 600,

  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
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

export const FormSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1.75),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const FormSectionFirst = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const MetaList = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  rowGap: theme.spacing(1.5),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: 0,
    alignItems: 'start',
  },
}));

export const MetaColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minWidth: 0,

  [theme.breakpoints.up('sm')]: {
    '&:first-of-type': {
      paddingRight: theme.spacing(3),
      borderRight: `1px solid ${theme.palette.divider}`,
    },

    '&:last-of-type': {
      paddingLeft: theme.spacing(3),
    },
  },
}));

export const MetaRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  minWidth: 0,
});

export const MetaLabel = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '18px',
  flexShrink: 0,
}));

export const MetaValue = styled('span')<{ $italic?: boolean }>(({ theme, $italic }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '20px',
  textAlign: 'right',
  fontStyle: $italic ? 'italic' : 'normal',
  minWidth: 0,
}));

/** Zone A action area — divider only, not a nested card. */
export const ActionSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${zoneABorder(theme.palette.mode)}`,
}));

/** Radios + reason side-by-side when Zone A has enough width. */
export const ManageGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),

  [theme.breakpoints.up('sm')]: {
    // Radios column slightly wider; both columns equal height
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
    alignItems: 'stretch',
  },
}));

export const ManageColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  minWidth: 0,
}));

/** Neutral slate card — sits on the pink Zone A panel. */
export const VacationSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  alignItems: 'stretch',
  padding: theme.spacing(2),
  borderRadius: 12,
  boxSizing: 'border-box',
  backgroundColor:
    theme.palette.mode === 'light' ? '#F1F4F6' : 'rgba(255, 255, 255, 0.06)',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export const VacationCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  flex: 1,
}));

export const VacationIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: theme.palette.mode === 'light' ? '#4A8B6F' : theme.palette.success.light,
}));

export const VacationActionButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  flexShrink: 0,
  minHeight: 36,
  paddingInline: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,

  '&:hover': {
    borderColor: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
  },

  '&.Mui-disabled': {
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.disabled,
  },
}));

/** Zone B: 4 time fields in one row on desktop. */
export const HoursRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1),

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

/** Zone B: working days | exceptions side by side. */
/** Working days | exceptions — titles on one row, chips opposite exception input. */
export const ConstructorSplit = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),

  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: `
      "daysHead exceptHead"
      "daysBody exceptBody"
    `,
    columnGap: theme.spacing(1.25),
    rowGap: theme.spacing(0.75),
    alignItems: 'center',
  },
}));

export const ConstructorDaysHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 28,

  [theme.breakpoints.up('md')]: {
    gridArea: 'daysHead',
  },
}));

export const ConstructorDaysBody = styled('div')(({ theme }) => ({
  minWidth: 0,

  [theme.breakpoints.up('md')]: {
    gridArea: 'daysBody',
  },
}));

export const ConstructorExceptHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  minHeight: 28,
  minWidth: 0,

  [theme.breakpoints.up('md')]: {
    gridArea: 'exceptHead',
  },
}));

export const ConstructorExceptBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  minWidth: 0,

  [theme.breakpoints.up('md')]: {
    gridArea: 'exceptBody',
  },
}));

/** Zone B: format | price side by side. */
export const FormatPriceRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
    alignItems: 'end',
  },
}));

export const ExceptionBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 6px',
  borderRadius: 6,
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: 600,
  color: theme.palette.error.main,
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(196, 92, 92, 0.1)' : 'rgba(224, 122, 122, 0.16)',
}));

export const SectionLabel = styled('strong')(({ theme }) => ({
  display: 'block',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ParamList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const PlannedRangeChips = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const PlannedRangeChip = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 32,
  padding: theme.spacing(0, 1.5),
  borderRadius: 8,
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: mintSoft(theme.palette.mode),
  color: theme.palette.primary.main,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '18px',
  cursor: 'pointer',

  '&:hover': {
    outline: `1.5px solid ${theme.palette.primary.main}`,
  },
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

export const RadioGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

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
  gap: theme.spacing(1),
  minWidth: 0,
  minHeight: 0,
  height: '100%',
}));

/** Fills the reason column so it matches the radios column height. */
export const ReasonTextField = styled(ZoneTextField)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',

  '& .MuiOutlinedInput-root': {
    flex: 1,
    alignItems: 'flex-start',
    height: '100%',
  },

  '& .MuiInputBase-inputMultiline': {
    height: '100% !important',
    boxSizing: 'border-box',
  },
});

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

export const VacationHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

export const FieldFull = styled('div')(({ theme }) => ({
  gridColumn: '1 / -1',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const SegmentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const DurationSegmentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
}));

export const SegmentButton = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  margin: 0,
  height: 36,
  minHeight: 36,
  minWidth: 48,
  padding: '0 12px',
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  verticalAlign: 'middle',
  transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
    duration: theme.transitions.duration.shorter,
  }),

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: $active
      ? theme.palette.primary.light
      : theme.palette.action.hover,
  },
}));

export const DurationSegmentButton = styled(SegmentButton)({
  flex: '0 0 auto',
  minWidth: 48,
  width: 'auto',
});

/** Presets + “or custom” + field — one horizontal row (wraps on narrow). */
export const DurationCustomRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const DurationCustomLabel = styled('span')(({ theme }) => ({
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  flexShrink: 0,
}));

export const DurationCustomHint = styled('span')(({ theme }) => ({
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const DurationCustomField = styled(TextField)(({ theme }) => ({
  width: 108,
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    minHeight: 36,
  },
  '& .MuiOutlinedInput-input': {
    paddingTop: 8,
    paddingBottom: 8,
  },
}));

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

export const DaysOffBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const DaysOffDivider = styled('div')(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.divider,
  marginBlock: theme.spacing(0.5),
}));

export const WeekendActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const OutlineSoftButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minHeight: 36,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 10,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    boxShadow: 'none',
  },

  '&.Mui-disabled': {
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
  },
}));

/** Primary outline — “Add date” on exceptions header. */
export const PrimaryOutlineButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minHeight: 28,
  paddingInline: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '16px',
  borderRadius: 6,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,

  '& .MuiButton-startIcon': {
    marginRight: 4,
    marginLeft: 0,
  },

  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
    boxShadow: 'none',
  },
}));

export const WeekdayChipRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

export const WeekdayChip = styled('button')<{ $active?: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
  width: 36,
  height: 32,
  padding: 0,
  borderRadius: 8,
  border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  cursor: 'pointer',

  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const PrimarySaveButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: 44,
  marginTop: 'auto',
  paddingInline: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 12,
  boxShadow: 'none',

  '&:hover': {
    boxShadow: 'none',
  },
}));

export const DangerOutlineButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: 40,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  borderRadius: 10,
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

export const PlannedSchedulesSection = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const PlannedSchedulesHead = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const PlannedSchedulesTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PlannedSchedulesHint = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const PlannedScheduleCards = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const PlannedScheduleCard = styled('button')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  textAlign: 'left',
  padding: theme.spacing(2, 2.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: mintSoft(theme.palette.mode),
  },
}));

export const PlannedScheduleBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

export const PlannedScheduleRange = styled('strong')(({ theme }) => ({
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PlannedScheduleMeta = styled('span')(({ theme }) => ({
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

export const PlannedScheduleAction = styled('span')(({ theme }) => ({
  flexShrink: 0,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.primary.main,
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

export const ModalPaper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  width: '100%',
  boxSizing: 'border-box',
});

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

export const ModalActions = styled('div')<{ $spread?: boolean }>(({ theme, $spread }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: $spread ? 'space-between' : 'flex-end',
  alignItems: 'center',
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

export const DayChips = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
});

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

export const DayInfoChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: theme.spacing(0, 2.25),
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'default',
  userSelect: 'none',
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
  width: 100,
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
  textAlign: 'left',
}));

export const ModalBodyStrong = styled('strong')(({ theme }) => ({
  fontWeight: 600,
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
