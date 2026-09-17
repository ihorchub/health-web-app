export interface PatientProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  cityId: string;
  clinicId: string;
  photoUrl?: string;
}

export interface DoctorEducationItem {
  id: string;
  title: string;
  subtitle: string;
  years: string;
}

export interface DoctorProfileData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  cityId: string;
  clinicId: string;
  specialty: string;
  yearsPractice: number;
  languages: string;
  licenseFileName: string;
  consultationCount: number;
  ratingAverage: number;
  reviewCount: number;
  photoUrl: string;
  shortBioUk: string;
  shortBioEn: string;
  fullBioUk: string;
  fullBioEn: string;
  education: DoctorEducationItem[];
}

export type ProfileSection = 'basic' | 'about' | 'education' | 'contact';
