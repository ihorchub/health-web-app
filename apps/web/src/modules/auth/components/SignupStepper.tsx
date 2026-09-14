import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  StepCol,
  StepColLast,
  StepDot,
  StepDotRow,
  StepLabel,
  StepLine,
  StepperRow,
} from '@/modules/auth/components/authStyles';
import type { SignupStep } from '@/modules/auth/signup/utils/signupDraft';

const LabelSlot = styled('div')({
  display: 'flex',
  width: 32,
  justifyContent: 'center',
  flexShrink: 0,
});

interface SignupStepperProps {
  activeStep: SignupStep;
}

const STEPS: SignupStep[] = [1, 2, 3, 4];

export const SignupStepper = ({ activeStep }: SignupStepperProps) => {
  const { t } = useTranslation('auth');

  return (
    <StepperRow aria-label={t('signup.stepperLabel')}>
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        const active = step === activeStep;
        const done = step < activeStep;
        const label = t(`signup.steps.${step}`);

        if (isLast) {
          return (
            <StepColLast key={step}>
              <StepDot $active={active} $done={done}>
                {step}
              </StepDot>
              <StepLabel $active={active || done}>{label}</StepLabel>
            </StepColLast>
          );
        }

        return (
          <StepCol key={step}>
            <StepDotRow>
              <StepDot $active={active} $done={done}>
                {step}
              </StepDot>
              <StepLine />
            </StepDotRow>
            <LabelSlot>
              <StepLabel $active={active || done}>{label}</StepLabel>
            </LabelSlot>
          </StepCol>
        );
      })}
    </StepperRow>
  );
};
