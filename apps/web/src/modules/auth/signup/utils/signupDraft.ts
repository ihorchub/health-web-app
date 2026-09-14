import type { AuthRole } from '@/api/auth';

export type SignupStep = 1 | 2 | 3 | 4;

export interface SignupDraft {
  registrationId: string;
  email: string;
  role: AuthRole;
  step: SignupStep;
  devVerifyToken?: string;
  redirectTo?: string;
}

const STORAGE_KEY = 'medicly_signup_draft';

export const loadSignupDraft = (): SignupDraft | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as SignupDraft;
  } catch {
    return null;
  }
};

export const saveSignupDraft = (draft: SignupDraft) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearSignupDraft = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};
