export enum AppRoute {
  HOME = '/',
  DEV = '/dev',
  LOGIN = '/login',
  SIGNUP = '/signup',
  PRIVACY = '/privacy',
  TERMS = '/terms',
  APPOINTMENTS = '/appointments',
  DOCTOR_DAY = '/doctor/day',
  DOCTOR_PROFILE = '/doctors/:doctorId',
}

export const doctorProfilePath = (doctorId: string) => `/doctors/${doctorId}`;
