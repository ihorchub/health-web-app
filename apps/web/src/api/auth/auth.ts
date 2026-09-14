import { customInstance } from '@/api/mutator/customInstance';
import type {
  AuthSessionResponse,
  LoginBody,
  LogoutResponse,
  MeResponse,
  RegisterCompleteBody,
  RegisterResendEmailBody,
  RegisterResendEmailResponse,
  RegisterStep1Body,
  RegisterStep1Response,
  RegisterStep3DoctorBody,
  RegisterStep3PatientBody,
  RegisterStep3Response,
  RegisterVerifyEmailBody,
  RegisterVerifyEmailResponse,
} from '@/api/auth/types';

export const getAuthMe = () => {
  return customInstance<MeResponse | null>({
    url: '/v1/auth/me',
    method: 'GET',
  });
};

export const postAuthLogin = (data: LoginBody) => {
  return customInstance<AuthSessionResponse>({
    url: '/v1/auth/login',
    method: 'POST',
    data,
  });
};

export const postAuthLogout = () => {
  return customInstance<LogoutResponse>({
    url: '/v1/auth/logout',
    method: 'POST',
  });
};

export const postAuthRegisterStep1 = (data: RegisterStep1Body) => {
  return customInstance<RegisterStep1Response>({
    url: '/v1/auth/register/step-1',
    method: 'POST',
    data,
  });
};

export const postAuthRegisterVerifyEmail = (data: RegisterVerifyEmailBody) => {
  return customInstance<RegisterVerifyEmailResponse>({
    url: '/v1/auth/register/verify-email',
    method: 'POST',
    data,
  });
};

export const postAuthRegisterResendEmail = (data: RegisterResendEmailBody) => {
  return customInstance<RegisterResendEmailResponse>({
    url: '/v1/auth/register/resend-email',
    method: 'POST',
    data,
  });
};

export const postAuthRegisterStep3Patient = (data: RegisterStep3PatientBody) => {
  return customInstance<RegisterStep3Response>({
    url: '/v1/auth/register/step-3/patient',
    method: 'POST',
    data,
  });
};

export const postAuthRegisterStep3Doctor = (data: RegisterStep3DoctorBody) => {
  const formData = new FormData();
  formData.append('registrationId', data.registrationId);
  formData.append('dob', data.dob);
  formData.append('cityId', data.cityId);
  formData.append('clinicId', data.clinicId);
  formData.append('specialty', data.specialty);
  formData.append('yearsPractice', String(data.yearsPractice));
  formData.append('visitDurationMinutes', String(data.visitDurationMinutes));

  if (data.licenseFile) {
    formData.append('licenseFile', data.licenseFile);
  }

  return customInstance<RegisterStep3Response>({
    url: '/v1/auth/register/step-3/doctor',
    method: 'POST',
    data: formData,
  });
};

export const postAuthRegisterComplete = (data: RegisterCompleteBody) => {
  return customInstance<AuthSessionResponse>({
    url: '/v1/auth/register/complete',
    method: 'POST',
    data,
  });
};
