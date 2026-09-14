import { IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Body, TitleH2 } from '@/components/Text';
import {
  CenterCard,
  PrimaryButton,
  StepHeading,
  SuccessIconWrap,
} from '@/modules/auth/components/authStyles';
import {
  clearSignupDraft,
  type SignupDraft,
} from '@/modules/auth/signup/utils/signupDraft';
import { AppRoute } from '@/utils/routeUtils/routes';

interface Step4SuccessProps {
  draft: SignupDraft;
}

export const Step4Success = ({ draft }: Step4SuccessProps) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const handleContinue = () => {
    clearSignupDraft();
    void navigate(draft.redirectTo || AppRoute.HOME, { replace: true });
  };

  return (
    <>
      <StepHeading>
        <TitleH2>{t('signup.step4.title')}</TitleH2>
        <Body color="textSecondary">{t('signup.step4.subtitle')}</Body>
      </StepHeading>

      <CenterCard>
        <SuccessIconWrap>
          <IconCheck size={36} stroke={2.5} />
        </SuccessIconWrap>
        <PrimaryButton
          type="button"
          variant="contained"
          color="primary"
          onClick={handleContinue}
        >
          {t('signup.step4.submit')}
        </PrimaryButton>
      </CenterCard>
    </>
  );
};
