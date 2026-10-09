import {
  getAuthMe as generatedGetAuthMe,
  postAuthLogin as generatedPostAuthLogin,
  postAuthLogout as generatedPostAuthLogout,
  postAuthRegisterComplete as generatedPostAuthRegisterComplete,
  postAuthRegisterResendEmail as generatedPostAuthRegisterResendEmail,
  postAuthRegisterStep1 as generatedPostAuthRegisterStep1,
  postAuthRegisterStep3Patient as generatedPostAuthRegisterStep3Patient,
  postAuthRegisterVerifyEmail as generatedPostAuthRegisterVerifyEmail,
} from '@/api/generated/auth/auth';
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

export const getAuthMe = (signal?: AbortSignal) => {
  return generatedGetAuthMe(undefined, signal) as Promise<MeResponse | null>;
};

export const postAuthLogin = (data: LoginBody) => {
  return generatedPostAuthLogin(data) as Promise<AuthSessionResponse>;
};

export const postAuthLogout = () => {
  return generatedPostAuthLogout() as Promise<LogoutResponse>;
};

export const postAuthRegisterStep1 = (data: RegisterStep1Body) => {
  return generatedPostAuthRegisterStep1(data) as Promise<RegisterStep1Response>;
};

export const postAuthRegisterVerifyEmail = (data: RegisterVerifyEmailBody) => {
  return generatedPostAuthRegisterVerifyEmail(
    data,
  ) as Promise<RegisterVerifyEmailResponse>;
};

export const postAuthRegisterResendEmail = (data: RegisterResendEmailBody) => {
  return generatedPostAuthRegisterResendEmail(
    data,
  ) as Promise<RegisterResendEmailResponse>;
};

export const postAuthRegisterStep3Patient = (data: RegisterStep3PatientBody) => {
  return generatedPostAuthRegisterStep3Patient(
    data,
  ) as Promise<RegisterStep3Response>;
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
  return generatedPostAuthRegisterComplete(data) as Promise<AuthSessionResponse>;
};
