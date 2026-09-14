import { Dialog, styled } from '@mui/material';

export const ProfileDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(22, 62, 82, 0.45)',
  },

  '& .MuiDialog-container': {
    alignItems: 'center',
  },

  '& .MuiDialog-paper': {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2),
    width: '100%',
    maxWidth: 920,
    maxHeight: 'calc(100dvh - 32px)',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 1px 2px rgba(22, 62, 82, 0.06), 0px 24px 64px rgba(22, 62, 82, 0.2)',
  },
}));

export const DialogShell = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  minHeight: 0,
  maxHeight: '100%',
  width: '100%',
  overflow: 'hidden',
});

export const DialogHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexShrink: 0,
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderText = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
  flexGrow: 1,
}));

export const StepLabel = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}));

export const DialogTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  lineHeight: '28px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const IconRoundButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  flexShrink: 0,
  padding: 0,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const DialogBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(3, 3.5),
}));

export const IdentityRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(3),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const Photo = styled('img')(({ theme }) => ({
  width: 140,
  height: 140,
  flexShrink: 0,
  objectFit: 'cover',
  borderRadius: 20,
  backgroundColor: theme.palette.action.hover,
}));

export const IdentityMain = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  minWidth: 0,
  flexGrow: 1,
  width: '100%',
}));

export const NameRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const NameBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
  flexGrow: 1,
}));

export const DoctorName = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 22,
  lineHeight: '30px',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const SpecialtyText = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const ClinicBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
});

export const FieldLabel = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}));

export const ClinicLine = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const AddressLine = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}));

export const FactsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  paddingBlock: theme.spacing(0.5),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
}));

export const FactCell = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flexGrow: 1,
  minWidth: 0,
});

export const FactValue = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const BioBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  width: '100%',
}));

export const BioText = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: theme.typography.body1.lineHeight,
  color: theme.palette.text.primary,
}));

export const PriceRatingRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
  paddingBlock: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const PriceBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const PriceRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(1.25),
}));

export const Price = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 22,
  lineHeight: '30px',
  fontWeight: 700,
  color: theme.palette.brand.main,
}));

export const StruckPrice = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
}));

export const RatingBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

export const RatingValueRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  color: theme.palette.primary.main,
}));

export const RatingNumber = styled('div')(({ theme }) => ({
  ...theme.typography.h3,
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ReviewCount = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const ReviewsSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.75),
  width: '100%',
}));

export const ReviewsHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const ReviewsTitle = styled('div')(({ theme }) => ({
  ...theme.typography.h3,
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ReviewItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
  paddingTop: theme.spacing(1.75),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const ReviewItemHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const ReviewAuthor = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ReviewStars = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flexShrink: 0,
  color: theme.palette.primary.main,
}));

export const ReviewScore = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ReviewText = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '22px',
  color: theme.palette.text.secondary,
}));

export const DialogFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexShrink: 0,
  padding: theme.spacing(1.5, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StateBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(4, 3.5),
}));
