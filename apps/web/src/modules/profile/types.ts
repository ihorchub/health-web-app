export interface PatientProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  cityId: string;
  clinicId: string;
  cityName: string;
  clinicName: string;
  photoUrl?: string;
}

export interface DoctorEducationItem {
  id: string;
  title: string;
  subtitle: string;
  years: string;
  kind: 'education' | 'certificate';
}

export interface DoctorReviewItem {
  id: string;
  author: string;
  rating: number;
  text: string;
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
  cityName: string;
  clinicName: string;
  address: string;
  specialtyLabel: string;
  yearsPractice: number;
  languages: string;
  licenseFileName: string;
  consultationCount: number;
  ratingAverage: number;
  reviewCount: number;
  basePrice: number;
  promoPrice?: number;
  format: 'offline' | 'online' | 'both';
  photoUrl: string;
  shortBioUk: string;
  shortBioEn: string;
  fullBioUk: string;
  fullBioEn: string;
  education: DoctorEducationItem[];
  reviews: DoctorReviewItem[];
}

export type ProfileSection = 'basic' | 'about' | 'education' | 'contact';
