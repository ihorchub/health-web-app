import { Button, Dialog, TextField, styled } from '@mui/material';

const cardShadow = '0 1px 2px rgba(22, 62, 82, 0.04)';
const iconSoftBg = '#E6F7F1';

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
  gap: 24,
  width: '100%',
  maxWidth: 1344,
  marginInline: 'auto',
  paddingTop: 24,
  paddingBottom: 32,
  paddingInline: 16,
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingInline: 48,
  },
}));

export const PageIntro = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  flexShrink: 0,
});

export const PageTitle = styled('h1')(({ theme }) => ({
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

export const PageSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  color: theme.palette.text.secondary,

  [theme.breakpoints.up('md')]: {
    fontSize: 16,
    lineHeight: '24px',
  },
}));

export const HeroCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  gap: 24,
  width: '100%',
  padding: 24,
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'light' ? cardShadow : 'none',
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const HeroLeft = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  flex: 1,
  minWidth: 0,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
}));

export const AvatarWrap = styled('div')({
  position: 'relative',
  width: 88,
  height: 88,
  flexShrink: 0,
});

export const Avatar = styled('img')({
  width: 88,
  height: 88,
  borderRadius: 999,
  objectFit: 'cover',
  display: 'block',
});

export const AvatarFallback = styled('div')(({ theme }) => ({
  width: 88,
  height: 88,
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: 28,
  fontWeight: 700,
  color: theme.palette.text.secondary,
}));

export const CameraButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 1px 3px rgba(22, 62, 82, 0.12)',
  cursor: 'pointer',
  color: theme.palette.text.primary,
}));

export const HeroText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  flex: 1,
  minWidth: 0,
});

export const HeroNameRow = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
});

export const HeroName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 22,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const SoftBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 999,
  backgroundColor: iconSoftBg,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.primary.dark,
}));

export const HeroMeta = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  color: theme.palette.text.secondary,
}));

export const HeroMuted = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.muted,
}));

export const HeroStats = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
  marginTop: 2,
});

export const HeroStat = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const HeroStatValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const HeroStatMuted = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const HeroDot = styled('span')(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: 999,
  backgroundColor: theme.palette.divider,
  flexShrink: 0,
}));

export const StarAccent = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

export const ViewProfileButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  minHeight: 42,
  paddingInline: 16,
  paddingBlock: 10,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  whiteSpace: 'nowrap',
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,

  '&:hover': {
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const SectionCard = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  width: '100%',
  padding: 24,
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.palette.mode === 'light' ? cardShadow : 'none',
  boxSizing: 'border-box',
}));

export const EducationCard = styled(SectionCard)({
  gap: 16,
});

export const SectionHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
});

export const SectionTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const EditLink = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flexShrink: 0,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

export const FieldRows = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 20,
});

export const FieldRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 16,

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: 32,
  },
}));

export const FieldItem = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  flex: 1,
  minWidth: 0,
  width: '100%',
});

export const FieldIcon = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: 999,
  backgroundColor: iconSoftBg,
  color: theme.palette.primary.main,
}));

export const FieldText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
});

export const BioFieldText = styled(FieldText)({
  gap: 4,
});

export const FieldLabel = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
}));

export const FieldValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const BioValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '24px',
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

export const EduList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: 16,
});

export const EduRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: 12,
});

export const EduText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
});

export const EduYears = styled('span')(({ theme }) => ({
  flexShrink: 0,
  width: 88,
  textAlign: 'right',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.muted,
}));

export const AddLink = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  gap: 6,
  width: '100%',
  marginTop: 8,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

export const ActionRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
}));

export const ProfileTextField = styled(TextField)({
  width: '100%',
});

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

/* Preview dialog */

export const PreviewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 920,
    margin: theme.spacing(2),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0 1px 2px rgba(22, 62, 82, 0.06), 0 24px 64px rgba(22, 62, 82, 0.2)'
        : 'none',
  },
}));

export const PreviewFactValueMedium = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const PreviewHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '20px 28px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const PreviewHeaderText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 0,
});

export const PreviewEyebrow = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const PreviewTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PreviewCloseIcon = styled('button')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: 'none',
  borderRadius: 999,
  background: 'none',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
}));

export const PreviewBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  padding: '24px 28px',
  flex: 1,
  overflow: 'auto',
});

export const PreviewIdentity = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: 24,
  },
}));

export const PreviewPhoto = styled('img')({
  width: 140,
  height: 140,
  borderRadius: 20,
  objectFit: 'cover',
  flexShrink: 0,
});

export const PreviewIdentityMain = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  flex: 1,
  minWidth: 0,
});

export const PreviewNameRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
});

export const PreviewNameBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 0,
});

export const PreviewDoctorName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 22,
  lineHeight: '30px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PreviewSpecialty = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const FavouriteButton = styled('button')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  color: theme.palette.primary.main,
}));

export const PreviewClinicBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
});

export const PreviewOverline = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const PreviewMutedOverline = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.muted,
}));

export const PreviewClinicName = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const PreviewAddress = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.muted,
}));

export const PreviewFacts = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  paddingBlock: 4,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: 32,
  },
}));

export const PreviewFact = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
});

export const PreviewFactValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const PreviewBioBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  width: '100%',
});

export const PreviewBioText = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '24px',
  color: theme.palette.text.primary,
}));

export const PreviewPriceRating = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  width: '100%',
  paddingBlock: 8,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const PreviewPriceBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const PreviewPriceRow = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  gap: 10,
});

export const PreviewPrice = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 22,
  lineHeight: '30px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PreviewStruckPrice = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

export const PreviewRatingBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 4,
  flexShrink: 0,
});

export const PreviewRatingRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const PreviewRatingNumber = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PreviewReviewCount = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const PreviewReviews = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  width: '100%',
});

export const PreviewReviewsHeader = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
});

export const PreviewReviewsTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const PreviewReviewItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  paddingBlock: 14,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const PreviewReviewHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
});

export const PreviewReviewAuthor = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const PreviewReviewScore = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
});

export const PreviewReviewScoreValue = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const PreviewReviewText = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '22px',
  color: theme.palette.muted,
}));

export const PreviewFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 16,
  padding: '16px 28px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const PreviewCloseButton = styled(Button)({
  minHeight: 44,
  minWidth: 140,
  paddingInline: 22,
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '20px',
});

export const SavingScrim = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(22, 62, 82, 0.45)' : 'rgba(11, 28, 36, 0.72)',
  padding: theme.spacing(2),
}));

export const SavingDialog = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  paddingBlock: 32,
  paddingInline: 40,
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const SavingLika = styled('img')({
  width: 70,
  height: 120,
  objectFit: 'contain',
  flexShrink: 0,
});

export const SavingTitle = styled('p')(({ theme }) => ({
  margin: 0,
  textAlign: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  lineHeight: '26px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const SavingHint = styled('p')(({ theme }) => ({
  margin: 0,
  textAlign: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));
