export type AuthRole = 'patient' | 'doctor';

export type SpecialtyId =
  'family_doctor' | 'cardiologist' | 'dermatologist' | 'paediatrician';

export type VisitDurationMinutes = 20 | 30 | 45;

export type Gender = 'female' | 'male';

export interface MeResponse {
  id: string;
  role: AuthRole;
  email: string;
  firstName: string;
  redirectTo: string;
  language: string | null;
  theme: string | null;
}

export interface AuthSessionResponse {
  userId: string;
  role: AuthRole;
  redirectTo: string;
}

export interface RegisterStep1Body {
  role: AuthRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  language?: string;
  theme?: string;
}

export interface RegisterStep1Response {
  registrationId: string;
  email: string;
  role: AuthRole;
  nextStep: 'email';
  /** Present only in API development mode. */
  devVerifyToken?: string;
}

export interface RegisterVerifyEmailBody {
  registrationId: string;
  token: string;
}

export interface RegisterVerifyEmailResponse {
  registrationId: string;
  emailVerified: true;
  role: AuthRole;
  nextStep: 'profile';
}

export interface RegisterResendEmailBody {
  registrationId: string;
}

export interface RegisterResendEmailResponse {
  ok: true;
  sentTo: string;
}

export interface RegisterStep3PatientBody {
  registrationId: string;
  dob: string;
  gender: Gender;
  cityId: string;
  clinicId: string;
}

export interface RegisterStep3DoctorBody {
  registrationId: string;
  dob: string;
  cityId: string;
  clinicId: string;
  specialty: SpecialtyId;
  yearsPractice: number;
  visitDurationMinutes: VisitDurationMinutes;
  licenseFile?: File | null;
}

export interface RegisterStep3Response {
  registrationId: string;
  profileCompleted: true;
  nextStep: 'done';
}

export interface RegisterCompleteBody {
  registrationId: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LogoutResponse {
  ok: true;
}
