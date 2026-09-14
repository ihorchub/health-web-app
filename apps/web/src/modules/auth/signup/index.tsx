import { styled } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate } from 'react-router-dom';

import { BrandLogo } from '@/components/Layout/BrandLogo';
import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { ThemeToggleButton } from '@/components/Layout/ThemeToggleButton';
import { useAppRole } from '@/hooks/useAppRole';
import { SignupStepper } from '@/modules/auth/components/SignupStepper';
import {
  OnboardingHeader,
  OnboardingHeaderActions,
  OnboardingMain,
  OnboardingPage,
  SwitchLink,
} from '@/modules/auth/components/authStyles';
import { Step1General } from '@/modules/auth/signup/components/Step1General';
import { Step2Email } from '@/modules/auth/signup/components/Step2Email';
import { Step3Doctor } from '@/modules/auth/signup/components/Step3Doctor';
import { Step3Patient } from '@/modules/auth/signup/components/Step3Patient';
import { Step4Success } from '@/modules/auth/signup/components/Step4Success';
import {
  clearSignupDraft,
  loadSignupDraft,
  saveSignupDraft,
  type SignupDraft,
} from '@/modules/auth/signup/utils/signupDraft';
import { AppRoute } from '@/utils/routeUtils/routes';

const LoginTextLink = styled(RouterLink)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 500,
  color: theme.palette.text.primary,
  textDecoration: 'none',

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export const SignupPage = () => {
  const { t } = useTranslation('auth');
  const { me, isLoading: meLoading } = useAppRole();
  const [draft, setDraft] = useState<SignupDraft | null>(() => loadSignupDraft());

  if (!meLoading && me && draft?.step !== 4) {
    return <Navigate to={me.redirectTo || AppRoute.HOME} replace />;
  }

  const activeStep = draft?.step ?? 1;

  const updateDraft = (next: SignupDraft) => {
    saveSignupDraft(next);
    setDraft(next);
  };

  const restart = () => {
    clearSignupDraft();
    setDraft(null);
  };

  return (
    <OnboardingPage>
      <OnboardingHeader>
        <BrandLogo to={AppRoute.HOME} />
        <OnboardingHeaderActions>
          <LanguageToggle />
          <ThemeToggleButton />
          <LoginTextLink to={AppRoute.LOGIN}>{t('signup.toLogin')}</LoginTextLink>
        </OnboardingHeaderActions>
      </OnboardingHeader>

      <OnboardingMain>
        <SignupStepper activeStep={activeStep} />

        {activeStep === 1 ? <Step1General onSuccess={updateDraft} /> : null}

        {activeStep === 2 && draft ? (
          <Step2Email draft={draft} onSuccess={updateDraft} />
        ) : null}

        {activeStep === 3 && draft?.role === 'patient' ? (
          <Step3Patient draft={draft} onSuccess={updateDraft} />
        ) : null}

        {activeStep === 3 && draft?.role === 'doctor' ? (
          <Step3Doctor draft={draft} onSuccess={updateDraft} />
        ) : null}

        {activeStep === 4 && draft ? <Step4Success draft={draft} /> : null}

        {activeStep > 1 && activeStep < 4 ? (
          <SwitchLink
            to={AppRoute.SIGNUP}
            onClick={(event) => {
              event.preventDefault();
              restart();
            }}
          >
            {t('signup.startOver')}
          </SwitchLink>
        ) : null}
      </OnboardingMain>
    </OnboardingPage>
  );
};
