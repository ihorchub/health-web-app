import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  styled,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const AuthPage = styled('section')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  boxSizing: 'border-box',
}));

export const AuthChromeBar = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  zIndex: 1,
}));

export const AuthShell = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: 960,
  minHeight: 560,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 1px 2px rgba(22, 62, 82, 0.06), 0px 8px 24px rgba(22, 62, 82, 0.06)',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    maxWidth: 480,
    minHeight: 'auto',
  },
}));

export const BrandPanel = styled('aside')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: 380,
  flexShrink: 0,
  paddingTop: theme.spacing(4),
  paddingBottom: 28,
  paddingInline: theme.spacing(4),
  gap: theme.spacing(4),
  backgroundColor: theme.palette.brand.main,
  color: theme.palette.onBrand,

  [theme.breakpoints.down('md')]: {
    width: '100%',
    minHeight: 280,
  },
}));

export const BrandLogoImg = styled('img')({
  width: 'auto',
  display: 'block',
});

export const BrandCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BrandTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 700,
  color: theme.palette.onBrand,
}));

export const BrandSubtitle = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 400,
  color: theme.palette.onBrand,
  opacity: 0.92,
}));

export const BrandMascot = styled('img')({
  width: 180,
  height: 'auto',
  display: 'block',
  marginInline: 'auto',
  objectFit: 'contain',
});

export const FormPanel = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  gap: theme.spacing(2.5),
  paddingBlock: 36,
  paddingInline: 48,
  backgroundColor: theme.palette.background.paper,
  margin: 0,

  [theme.breakpoints.down('md')]: {
    paddingInline: theme.spacing(3),
    paddingBlock: theme.spacing(4),
  },
}));

export const FormIntro = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const FieldStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const FieldLabel = styled('label')(({ theme }) => ({
  display: 'block',
  marginBottom: 6,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const AuthTextField = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiOutlinedInput-root': {
    minHeight: 48,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },

  '& .MuiOutlinedInput-input': {
    paddingInline: 16,
    fontSize: 16,
    lineHeight: '24px',
  },
}));

export const AuthSelect = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiOutlinedInput-root': {
    minHeight: 44,
    borderRadius: theme.shape.borderRadius,
  },
}));

export const PasswordToggle = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const PrimaryButton = styled(Button)({
  width: '100%',
  minHeight: 48,
  color: '#FFFFFF',

  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    color: '#FFFFFF',
  },
});

export const FormActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
  marginTop: theme.spacing(6),
}));

export const ErrorText = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.error.main,
}));

export const SwitchLink = styled(RouterLink)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.primary.main,
  textDecoration: 'none',
  textAlign: 'center',

  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const OnboardingPage = styled('section')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  width: '100%',
  minHeight: '100%',
  backgroundColor: theme.palette.background.default,
}));

export const OnboardingHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  paddingInline: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down('md')]: {
    paddingInline: theme.spacing(2),
  },
}));

export const OnboardingHeaderActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const OnboardingMain = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 560,
  marginInline: 'auto',
  paddingBlock: theme.spacing(4),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',
}));

export const StepHeading = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
  maxWidth: 520,
  textAlign: 'left',
}));

export const FormCard = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 520,
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 2px 12px rgba(22, 62, 82, 0.08)',
  boxSizing: 'border-box',
}));

export const RoleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  width: '100%',
}));

export const SegmentButton = styled('button')<{ $active?: boolean }>(
  ({ theme, $active }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 44,
    border: $active ? 'none' : `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: $active
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    color: $active ? '#FFFFFF' : theme.palette.text.primary,
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    lineHeight: '20px',
    fontWeight: $active ? 600 : 500,
  }),
);

export const NameRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  width: '100%',
  marginTop: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export const NameCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const ConsentRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
  marginTop: theme.spacing(4),
}));

export const ConsentLabel = styled(FormControlLabel)(({ theme }) => ({
  alignItems: 'flex-start',
  marginLeft: 0,
  marginRight: 0,
  gap: theme.spacing(1.5),

  '& .MuiFormControlLabel-label': {
    fontSize: 13,
    lineHeight: '18px',
    color: theme.palette.primary.main,
  },
}));

export const ConsentCheckbox = styled(Checkbox)({
  padding: 0,
  marginTop: 1,
});

export const InlineLink = styled(RouterLink)({
  color: 'inherit',
  fontWeight: 600,
  textDecoration: 'underline',
});

export const StepperRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: 560,
});

export const StepCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: 8,
  minWidth: 0,
});

export const StepColLast = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  gap: 8,
});

export const StepDotRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const StepDot = styled('div')<{ $active?: boolean; $done?: boolean }>(
  ({ theme, $active, $done }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: 999,
    backgroundColor:
      $active || $done
        ? theme.palette.primary.main
        : theme.palette.action.disabledBackground,
    color: $active || $done ? '#FFFFFF' : theme.palette.text.disabled,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    lineHeight: '18px',
    fontWeight: $active ? 600 : 500,
  }),
);

export const StepLine = styled('div')(({ theme }) => ({
  height: 2,
  flexGrow: 1,
  marginInline: 4,
  backgroundColor: theme.palette.divider,
}));

export const StepLabel = styled('span')<{ $active?: boolean }>(({ theme, $active }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 11,
  lineHeight: '14px',
  fontWeight: $active ? 600 : 400,
  color: $active ? theme.palette.text.primary : theme.palette.text.secondary,
  textAlign: 'center',
  width: 'max-content',
}));

export const TextButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.primary.main,
  textAlign: 'left',

  '&:disabled': {
    cursor: 'default',
    opacity: 0.6,
  },
}));

export const UploadBox = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  width: '100%',
  minHeight: 72,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
  cursor: 'pointer',
  boxSizing: 'border-box',
}));

export const UploadTitle = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

export const UploadHint = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  color: theme.palette.text.secondary,
}));

export const HiddenFileInput = styled('input')({
  display: 'none',
});

export const SuccessIconWrap = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 72,
  height: 72,
  borderRadius: 999,
  backgroundColor:
    theme.palette.mode === 'light' ? '#E8F7F2' : 'rgba(62, 196, 163, 0.16)',
  color: theme.palette.primary.main,
  marginInline: 'auto',
}));

export const CenterCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  width: '100%',
  maxWidth: 520,
  paddingBlock: theme.spacing(5),
  paddingInline: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 2px 12px rgba(22, 62, 82, 0.08)',
  boxSizing: 'border-box',
}));

export const FieldBlock = styled('div')<{ $mt?: number }>(({ theme, $mt = 0 }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: theme.spacing($mt),
}));

export const ProfileFields = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  width: '100%',
});

export const ProfileRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const SubmitSpacer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: '100%',
}));
