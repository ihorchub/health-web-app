import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { usePostAuthLogin } from '@/api/auth';
import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { ThemeToggleButton } from '@/components/Layout/ThemeToggleButton';
import { Body, TitleH3 } from '@/components/Text';
import { useAppRole } from '@/hooks/useAppRole';
import {
  AuthChromeBar,
  AuthPage,
  AuthShell,
  AuthTextField,
  BrandCopy,
  BrandLogoImg,
  BrandMascot,
  BrandPanel,
  BrandSubtitle,
  BrandTitle,
  ErrorText,
  FieldLabel,
  FieldStack,
  FormActions,
  FormIntro,
  FormPanel,
  PasswordToggle,
  PrimaryButton,
  SwitchLink,
} from '@/modules/auth/components/authStyles';
import { FieldName } from '@/modules/auth/login/form/fields';
import {
  validationSchema,
  type LoginFormValues,
} from '@/modules/auth/login/form/validation';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { AppRoute } from '@/utils/routeUtils/routes';

const BRAND_LOGO = '/brand/logo/medicly-logo-header-dark@2x.png';
const LIKA_WELCOME = '/brand/lika-poses/lika1.png';

export const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { me, isLoading: meLoading } = useAppRole();
  const loginMutation = usePostAuthLogin();
  const mapError = useAuthApiErrorMessage();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: validationSchema,
    defaultValues: {
      [FieldName.email]: '',
      [FieldName.password]: '',
    },
  });

  const safeReturnTo =
    returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : null;

  if (!meLoading && me) {
    return <Navigate to={safeReturnTo || me.redirectTo || AppRoute.HOME} replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      void navigate(safeReturnTo || result.redirectTo || AppRoute.HOME, {
        replace: true,
      });
    } catch (error) {
      toast.error(mapError(error));
    }
  });

  return (
    <AuthPage>
      <AuthChromeBar>
        <LanguageToggle />
        <ThemeToggleButton />
      </AuthChromeBar>

      <AuthShell>
        <BrandPanel>
          <BrandLogoImg src={BRAND_LOGO} alt={t('login.title')} />
          <BrandCopy>
            <BrandTitle>{t('login.brandTitle')}</BrandTitle>
            <BrandSubtitle>{t('login.brandSubtitle')}</BrandSubtitle>
          </BrandCopy>
          <BrandMascot src={LIKA_WELCOME} alt="" />
        </BrandPanel>

        <FormPanel onSubmit={onSubmit} noValidate>
          <FormIntro>
            <TitleH3>{t('login.title')}</TitleH3>
            <Body color="textSecondary">{t('login.subtitle')}</Body>
          </FormIntro>

          <FieldStack>
            <div>
              <FieldLabel htmlFor={FieldName.email}>{t('login.email')}</FieldLabel>
              <Controller
                name={FieldName.email}
                control={control}
                render={({ field }) => (
                  <AuthTextField
                    {...field}
                    id={FieldName.email}
                    type="email"
                    autoComplete="email"
                    placeholder={t('login.emailPlaceholder')}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>

            <div>
              <FieldLabel htmlFor={FieldName.password}>{t('login.password')}</FieldLabel>
              <Controller
                name={FieldName.password}
                control={control}
                render={({ field }) => (
                  <AuthTextField
                    {...field}
                    id={FieldName.password}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <PasswordToggle
                              type="button"
                              aria-label={
                                showPassword
                                  ? t('login.hidePassword')
                                  : t('login.showPassword')
                              }
                              onClick={() => {
                                setShowPassword((value) => !value);
                              }}
                            >
                              {showPassword ? (
                                <IconEyeOff size={18} />
                              ) : (
                                <IconEye size={18} />
                              )}
                            </PasswordToggle>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </div>
          </FieldStack>

          {loginMutation.isError ? (
            <ErrorText>{mapError(loginMutation.error)}</ErrorText>
          ) : null}

          <FormActions>
            <PrimaryButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loginMutation.isPending}
            >
              {t('login.submit')}
            </PrimaryButton>
            <SwitchLink to={AppRoute.SIGNUP}>{t('login.toSignup')}</SwitchLink>
          </FormActions>
        </FormPanel>
      </AuthShell>
    </AuthPage>
  );
};
