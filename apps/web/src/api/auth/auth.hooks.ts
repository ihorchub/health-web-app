import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

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
  MeResponse,
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

const isMeQuery = (queryKey: readonly unknown[]) =>
  queryKey[0] === authQueryKeys.me[0] && queryKey[1] === authQueryKeys.me[1];

/** Drop non-session caches after login/logout so the next role does not see stale data. */
const clearNonSessionQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => !isMeQuery(query.queryKey),
  });
};

/** Resolve /auth/me into the cache before navigation so the header does not flash guest. */
const warmSessionMe = async (queryClient: QueryClient) => {
  await queryClient.fetchQuery({
    queryKey: authQueryKeys.me,
    queryFn: ({ signal }) => getAuthMe(signal),
  });
};

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: ({ signal }) => getAuthMe(signal),
    staleTime: 60_000,
  });
};

export const usePostAuthLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginBody) => postAuthLogin(data),
    onSuccess: async () => {
      await queryClient.cancelQueries();
      // Warm me BEFORE clearing other caches / navigating — avoids guest chrome flash.
      await warmSessionMe(queryClient);
      clearNonSessionQueries(queryClient);
    },
  });
};

export const usePostAuthLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAuthLogout,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: authQueryKeys.me });
      const previousMe = queryClient.getQueryData<MeResponse | null>(authQueryKeys.me);
      // Clear session immediately so UI does not wait on the network round-trip.
      queryClient.setQueryData<MeResponse | null>(authQueryKeys.me, null);
      clearNonSessionQueries(queryClient);
      return { previousMe };
    },
    onError: (_error, _variables, context) => {
      if (context && 'previousMe' in context) {
        queryClient.setQueryData(authQueryKeys.me, context.previousMe);
      }
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
      await queryClient.cancelQueries();
      await warmSessionMe(queryClient);
      clearNonSessionQueries(queryClient);
    },
  });
};
