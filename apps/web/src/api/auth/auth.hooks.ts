import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getAuthMe,
  postAuthLogin,
  postAuthLogout,
  postAuthRegisterComplete,
  postAuthRegisterResendEmail,
  postAuthRegisterStep1,
  postAuthRegisterStep3Doctor,
  postAuthRegisterStep3Patient,
  postAuthRegisterVerifyEmail,
} from '@/api/auth/auth';
import type {
  LoginBody,
  RegisterCompleteBody,
  RegisterResendEmailBody,
  RegisterStep1Body,
  RegisterStep3DoctorBody,
  RegisterStep3PatientBody,
  RegisterVerifyEmailBody,
} from '@/api/auth/types';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getAuthMe,
    staleTime: 60_000,
  });
};

export const usePostAuthLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginBody) => postAuthLogin(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
};

export const usePostAuthLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAuthLogout,
    onSuccess: async () => {
      queryClient.setQueryData(authQueryKeys.me, null);
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
};

export const usePostAuthRegisterStep1 = () => {
  return useMutation({
    mutationFn: (data: RegisterStep1Body) => postAuthRegisterStep1(data),
  });
};

export const usePostAuthRegisterVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: RegisterVerifyEmailBody) => postAuthRegisterVerifyEmail(data),
  });
};

export const usePostAuthRegisterResendEmail = () => {
  return useMutation({
    mutationFn: (data: RegisterResendEmailBody) => postAuthRegisterResendEmail(data),
  });
};

export const usePostAuthRegisterStep3Patient = () => {
  return useMutation({
    mutationFn: (data: RegisterStep3PatientBody) => postAuthRegisterStep3Patient(data),
  });
};

export const usePostAuthRegisterStep3Doctor = () => {
  return useMutation({
    mutationFn: (data: RegisterStep3DoctorBody) => postAuthRegisterStep3Doctor(data),
  });
};

export const usePostAuthRegisterComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterCompleteBody) => postAuthRegisterComplete(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
};
