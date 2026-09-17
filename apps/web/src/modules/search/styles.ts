import { Button, Drawer, MenuItem, TextField, styled } from '@mui/material';

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
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 1344,
  marginInline: 'auto',
  paddingBlock: theme.spacing(3),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    paddingInline: 48,
    gap: theme.spacing(2.5),
  },
}));

export const Hero = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  width: '100%',
  overflow: 'hidden',
  borderRadius: 20,
  paddingTop: 28,
  paddingInline: theme.spacing(3),
  backgroundColor: theme.palette.brand.main,
  backgroundImage:
    'radial-gradient(ellipse 50% 70% at 80% 48%, rgba(46, 177, 145, 0.2) 0%, rgba(46, 177, 145, 0.12) 32%, transparent 68%), linear-gradient(160deg, #1A4A5E 0%, #163E52 48%, #123748 100%)',

  [theme.breakpoints.up('md')]: {
    paddingInline: 40,
    minHeight: 305,
  },

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
}));

export const HeroCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  flex: 1,
  maxWidth: 720,
  paddingBottom: theme.spacing(3),
  color: theme.palette.onBrand,
}));

export const HeroTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  lineHeight: '36px',
  fontWeight: 700,
  color: theme.palette.onBrand,

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}));

export const HeroSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  marginTop: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  color: theme.palette.onBrand,
  opacity: 0.92,
}));

export const HeroSteps = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-start',

  [theme.breakpoints.down('sm')]: {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    width: '100%',
    paddingBottom: 4,
    WebkitOverflowScrolling: 'touch',
  },
}));

export const HeroStep = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: 96,
}));

export const HeroStepIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.12)',
  color: theme.palette.onBrand,
}));

export const HeroStepLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  textAlign: 'center',
  color: theme.palette.onBrand,
}));

export const HeroImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: 414,
  height: 'auto',
  objectFit: 'contain',
  alignSelf: 'flex-end',
  display: 'block',

  [theme.breakpoints.down('md')]: {
    maxWidth: 280,
    marginInline: 'auto',
  },
}));

export const SearchBar = styled('form')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
  minHeight: 56,
  paddingInline: 12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 1px 2px rgba(22, 62, 82, 0.04)'
      : 'none',
  boxSizing: 'border-box',

  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1.5),
  },
}));

export const SearchInput = styled('input')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: 48,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  color: theme.palette.text.primary,

  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

export const SearchSubmit = styled(Button)(({ theme }) => ({
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  minHeight: 40,
  height: 40,
  minWidth: 40,
  paddingInline: 18,
  flexShrink: 0,
  color: '#FFFFFF',

  [theme.breakpoints.down('sm')]: {
    paddingInline: 10,
  },
}));

export const SearchSubmitLabel = styled('span')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const MobileFilterButton = styled(Button)(({ theme }) => ({
  minHeight: 40,
  height: 40,
  minWidth: 40,
  flexShrink: 0,
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const MobileFilterLabel = styled('span')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const PopularRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const PopularLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const ChipButton = styled('button')<{ $active?: boolean }>(
  ({ theme, $active }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    height: 32,
    paddingInline: 12,
    borderRadius: 999,
    border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: $active
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    color: $active ? '#FFFFFF' : theme.palette.text.primary,
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    lineHeight: '18px',
    fontWeight: 500,
  }),
);

export const SectionTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const SpecialtyGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: theme.spacing(3),
  },
}));

export const SpecialtyCard = styled('button')<{ $active?: boolean }>(
  ({ theme, $active }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    minHeight: 118,
    padding: theme.spacing(2),
    borderRadius: 16,
    border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 1px 2px rgba(22, 62, 82, 0.06), 0px 8px 24px rgba(22, 62, 82, 0.06)'
        : 'none',
    cursor: 'pointer',
    textAlign: 'left',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
  }),
);

export const SpecialtyIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 999,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'rgba(46, 177, 145, 0.12)'
      : 'rgba(62, 196, 163, 0.16)',
  color: theme.palette.primary.main,
}));

export const SpecialtyName = styled('span')({
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
});

export const ContentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
  width: '100%',
}));

export const LeftColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  gap: 16,
});

export const ResultsWrap = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const Sidebar = styled('aside')(({ theme }) => ({
  display: 'none',
  width: 318,
  flexShrink: 0,
  flexDirection: 'column',
  gap: 20,
  padding: 20,
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 1px 2px rgba(22, 62, 82, 0.06), 0px 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const FiltersHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const ResetButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const FilterField = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiOutlinedInput-root': {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const FilterMenuItem = styled(MenuItem)({});

export const FilterGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  width: '100%',
});

export const FilterGroupTitle = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const CheckRow = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '18px',
  color: theme.palette.text.primary,
}));

export const RatingPills = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

export const RatingPill = styled('button')<{ $active?: boolean }>(
  ({ theme, $active }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingInline: 12,
    borderRadius: 8,
    border: `1px solid ${$active ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: $active ? 'rgba(46, 177, 145, 0.12)' : 'transparent',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    lineHeight: '16px',
    fontWeight: 600,
    color: theme.palette.brand.main,
  }),
);

export const PriceLabels = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const DoctorsHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  minHeight: 40,
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

export const FoundText = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const SortSelect = styled(TextField)(({ theme }) => ({
  minWidth: 220,

  '& .MuiOutlinedInput-root': {
    minHeight: 40,
    borderRadius: 8,
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minWidth: 0,
  },
}));

export const DoctorGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}));

export const DoctorCardRoot = styled('article')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: 17,
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 1px 2px rgba(22, 62, 82, 0.06), 0px 8px 24px rgba(22, 62, 82, 0.06)'
      : 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
}));

export const CardTop = styled('div')({
  display: 'flex',
  gap: 12,
  width: '100%',
});

export const Avatar = styled('img')({
  width: 64,
  height: 64,
  borderRadius: 999,
  objectFit: 'cover',
  flexShrink: 0,
});

export const CardIdentity = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  gap: 2,
});

export const NameRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
});

export const DoctorName = styled('h3')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '22px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const HeartButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  flexShrink: 0,
}));

export const SpecialtyText = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const ClinicText = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const RatingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
}));

export const Stars = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  gap: 0,
  color: theme.palette.primary.main,
}));

export const MetaBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const MetaRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const FormatBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  height: 24,
  paddingInline: 8,
  borderRadius: 8,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'rgba(46, 177, 145, 0.12)'
      : 'rgba(62, 196, 163, 0.16)',
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

export const PriceRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const Price = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StruckPrice = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

export const PromoBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  height: 22,
  paddingInline: 8,
  borderRadius: 6,
  backgroundColor: theme.palette.error.main,
  color: '#FFFFFF',
  fontFamily: theme.typography.fontFamily,
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: 700,
}));

export const CardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: 'auto',
}));

export const BookButton = styled(Button)({
  width: '100%',
  minHeight: 40,
  height: 40,
  color: '#FFFFFF',
});

export const LinkishButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

export const HintText = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

export const ShowMoreButton = styled(Button)(({ theme }) => ({
  alignSelf: 'center',
  minHeight: 48,
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
}));

export const StateBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  minHeight: 360,
  padding: theme.spacing(6, 3),
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
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  maxWidth: 360,
}));

export const StatusBadge = styled('span')<{ $tone: 'loading' | 'error' }>(
  ({ theme, $tone }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    height: 28,
    paddingInline: 12,
    borderRadius: 999,
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    lineHeight: '16px',
    fontWeight: 700,
    color: $tone === 'loading' ? theme.palette.primary.main : theme.palette.error.main,
    backgroundColor: $tone === 'loading' ? '#E8F7F2' : '#FCEAEA',

    ...(theme.palette.mode === 'dark'
      ? {
          backgroundColor:
            $tone === 'loading' ? 'rgba(46, 177, 145, 0.18)' : 'rgba(196, 92, 92, 0.22)',
        }
      : null),
  }),
);

export const TitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.25),
}));

export const SkeletonCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: 16,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxSizing: 'border-box',
  minHeight: 280,
}));

export const SkeletonRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const SkeletonCircle = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  flexShrink: 0,
  borderRadius: 999,
  backgroundColor: theme.palette.action.disabledBackground,
}));

export const SkeletonStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flexGrow: 1,
  minWidth: 0,
}));

export const SkeletonBar = styled('div')<{ $width?: string; $height?: number }>(
  ({ theme, $width = '100%', $height = 12 }) => ({
    width: $width,
    height: $height,
    flexShrink: 0,
    borderRadius: 6,
    backgroundColor: theme.palette.action.disabledBackground,
  }),
);

export const LoadingBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const LoadingBannerMascot = styled('img')({
  width: 56,
  height: 56,
  flexShrink: 0,
  objectFit: 'contain',
});

export const FiltersDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 390,
    maxHeight: '100dvh',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
}));

export const DrawerTopBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  flexShrink: 0,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const DrawerScroll = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

export const DrawerStickyFooter = styled('div')(({ theme }) => ({
  flexShrink: 0,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const DrawerCloseButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  cursor: 'pointer',
}));
